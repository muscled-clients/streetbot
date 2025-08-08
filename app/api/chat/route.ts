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

IMPORTANT: When location is ambiguous, make a reasonable assumption and confirm.

When someone asks for help:
1. Acknowledge their need with empathy
2. If location is unclear or ambiguous, make an assumption and confirm
3. Search for services immediately when you have any location info
4. DO NOT list service names or details in your response

Example conversation flows:

User: "I need food near bloor station"
You: "I'm searching for food services near Bloor-Yonge station. If you meant a different Bloor station like Bloor West or Old Mill, just let me know. I've found several food options nearby."

User: "food near dundas" 
You: "I'm searching for food services near Yonge and Dundas. If you meant Dundas West or another Dundas location, let me know and I'll adjust. I've found several options within walking distance."

User: "I need food"
You: "I can help you find food services. What neighborhood or intersection are you near?"

Be proactive - when in doubt, search first and let them correct if needed.`;

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
            // Try a simpler query without the RPC function - but include all fields
            const { data: fallbackResults } = await supabase
              .from('services')
              .select('*')
              .not('latitude', 'is', null)
              .not('longitude', 'is', null)
              .limit(20);
              
            services = fallbackResults || [];
            console.log('Fallback service sample:', services[0] ? Object.keys(services[0]) : 'No services');
          } else {
            services = searchResults || [];
            console.log('RPC service sample:', services[0] ? Object.keys(services[0]) : 'No services');
            
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
${locationDescription.includes('yonge and') && latestMessage.includes('bloor') && !latestMessage.includes('yonge') ? 
  'IMPORTANT: You assumed they meant Bloor-Yonge station. Mention this assumption and that they can specify a different Bloor location if needed.' : ''}
${locationDescription.includes('yonge and') && latestMessage.includes('dundas') && !latestMessage.includes('yonge') ? 
  'IMPORTANT: You assumed they meant Yonge and Dundas. Mention this assumption and that they can specify a different Dundas location if needed.' : ''}

User message: "${latestMessage}"

${services?.length > 0 ? 
  `Tell them you found ${services.length} services. They will see the service cards below.` : 
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