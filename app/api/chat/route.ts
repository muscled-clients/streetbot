import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { supabase } from '@/lib/supabase/client';
import { GeocodingService } from '@/utils/geocoding';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `You are StreetBot, a compassionate AI assistant helping people find essential services in Toronto.

Core principles:
- Be warm, empathetic, and non-judgmental
- Use simple, clear language (5th grade reading level)
- Prioritize immediate needs (safety, food, shelter)
- Never make assumptions about someone's situation
- Respect dignity and autonomy

IMPORTANT: Location is required to find services.

When someone asks for help:
1. First acknowledge their need with empathy
2. ALWAYS ask for their location if not provided (neighborhood, intersection, or postal code)
3. DO NOT search for services until you have a location
4. Once you have location, confirm you're searching in that area
5. DO NOT list service names or details in your response

Example conversation flow:
User: "I need food"
You: "I understand you need food, and I'm here to help. To find the closest food services to you, could you share what neighborhood you're in or a nearby intersection?"

User: "I'm near Yonge and Dundas"
You: "Thank you. I'm searching for food services near Yonge and Dundas. I've found several options within walking distance."

Keep responses brief and always prioritize getting location information first.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userLocation } = await req.json();
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;
    
    // Check if user is asking about a specific service
    const serviceDetailPattern = /tell me (?:more )?about (.+)|more (?:details|info|information) (?:about|on) (.+)|what (?:services|programs) does (.+) (?:offer|provide)|(.+) services|(.+) programs/i;
    const serviceMatch = latestMessage.match(serviceDetailPattern);
    
    let services = null;
    let hasLocation = false;
    let locationDescription = '';
    let isServiceQuery = false;
    
    if (serviceMatch) {
      // User is asking about a specific service
      const serviceName = (serviceMatch[1] || serviceMatch[2] || serviceMatch[3] || serviceMatch[4] || serviceMatch[5]).trim();
      
      // Search for the service by name
      const { data: serviceResults, error } = await supabase
        .from('services')
        .select('*')
        .ilike('title', `%${serviceName}%`)
        .limit(5);
      
      if (serviceResults && serviceResults.length > 0) {
        services = serviceResults;
        isServiceQuery = true;
        console.log(`📋 Found ${services.length} services matching: ${serviceName}`);
      }
    }
    
    // Only do location search if not a service detail query
    if (!isServiceQuery) {
      // Detect location from the message using GeocodingService
      const locationContext = GeocodingService.detectLocationIntent(latestMessage);
      
      // PRIORITIZE text-based location over browser geolocation
      // This fixes the Morocco issue - text location always wins!
      if (locationContext) {
        hasLocation = true;
        locationDescription = locationContext.address;
        console.log(`📍 Detected location from text: ${locationContext.address} (${locationContext.coordinates.lat}, ${locationContext.coordinates.lng})`);
        
        // Extract radius preference from message
        const customRadius = GeocodingService.extractRadiusPreference(latestMessage);
        
        try {
          // Search for services using PostGIS location search
          const { data: searchResults, error: searchError } = await supabase.rpc(
            'search_services_by_location',
            {
              user_lat: locationContext.coordinates.lat,
              user_lng: locationContext.coordinates.lng,
              radius_meters: customRadius,
              max_results: 20,
            }
          );
          
          if (searchError) {
            console.error('Location search error:', searchError);
            // Try a simpler query without the RPC function
            const { data: fallbackResults } = await supabase
              .from('services')
              .select('*')
              .not('latitude', 'is', null)
              .not('longitude', 'is', null)
              .limit(20);
              
            services = fallbackResults || [];
          } else {
            services = searchResults || [];
            
            // If too few results, expand search
            if (services && services.length < 3) {
              console.log(`Only ${services.length} services found, expanding search...`);
              // Try wider radius
              const { data: expandedResults } = await supabase.rpc(
                'search_services_by_location',
                {
                  user_lat: locationContext.coordinates.lat,
                  user_lng: locationContext.coordinates.lng,
                  radius_meters: 10000, // 10km
                  max_results: 20,
                }
              );
              services = expandedResults || services;
            }
          }
        } catch (err) {
          console.error('Error in location search:', err);
          services = [];
        }
      } else if (userLocation && userLocation.lat && userLocation.lng) {
        // Use browser geolocation
        hasLocation = true;
        locationDescription = 'your current location';
        
        const { data: searchResults, error: searchError } = await supabase.rpc(
          'search_services_by_location',
          {
            user_lat: userLocation.lat,
            user_lng: userLocation.lng,
            radius_meters: 5000,
            max_results: 20,
          }
        );
        
        if (!searchError) {
          services = searchResults;
        }
      }
    }  // Close the if (!isServiceQuery) block
    
    // Format services for the context
    interface ServiceResult {
      id: string;
      title: string;
      category: string;
      description?: string;
      address_street?: string;
      address_city?: string;
      phone?: string;
      hours_of_operation?: string;
    }
    
    // Create the prompt with service context
    const contextualPrompt = isServiceQuery 
      ? `The user is asking about a specific service. Here are the details:

${services?.map((s: any) => `
Service: ${s.title}
Category: ${s.category}
Description: ${s.description || 'No description available'}
Address: ${s.address_street ? `${s.address_street}, ` : ''}${s.address_city || 'Toronto'}
Phone: ${s.phone || 'No phone listed'}
Hours: ${s.hours_of_operation || 'Hours not specified'}
Languages: ${Array.isArray(s.languages) ? s.languages.join(', ') : s.languages || 'Not specified'}
Accessibility: ${s.accessibility || 'Not specified'}
`).join('\n')}

User message: "${latestMessage}"

Provide helpful details about this service. Focus on what they offer, who they help, and how to access their services.`
      : hasLocation 
      ? `Found ${services?.length || 0} relevant services near ${locationDescription}.

User message: "${latestMessage}"

${services?.length > 0 ? 
  `Tell them you found ${services.length} services near their location. Mention the closest ones are ${services[0]?.distance_km || 'nearby'}. They will see the service cards below.` : 
  "Let them know you're looking but haven't found specific matches yet. Suggest they try a broader search area."}

Remember: Do NOT list full service details, just acknowledge you found options.`
      : `User has NOT provided location yet and geolocation is not available.

User message: "${latestMessage}"

You MUST ask for their location (neighborhood, intersection like "Queen and Bloor", or postal code) to help them find services.
Suggest popular intersections like: Yonge and Dundas, Queen and Bathurst, or King and Spadina.`;
    
    // Get streaming response from GPT-4
    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(0, -1), // Include previous messages for context
        { role: 'user', content: contextualPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });
    
    // Convert the response into a readable stream
    const stream = OpenAIStream(response, {
      onCompletion: async () => {
        // You could save the conversation to a database here
        console.log('Streaming completed');
      },
    });
    
    // Clean services to remove Unicode characters that break HTTP headers
    const cleanServices = services ? JSON.parse(
      JSON.stringify(services)
        .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '') // Remove zero-width and formatting chars
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    ) : [];
    
    // Return a StreamingTextResponse with cleaned services in headers
    return new StreamingTextResponse(stream, {
      headers: {
        'X-Services': JSON.stringify(cleanServices),
      },
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}