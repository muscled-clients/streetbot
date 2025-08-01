import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { supabase } from '@/lib/supabase/client';

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
    const { messages } = await req.json();
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;
    
    // Extract location from conversation
    let userLocation = '';
    const locationPatterns = [
      /(?:near|at|around|in)\s+([^.,!?]+)/i,
      /(yonge|dundas|queen|king|bloor|spadina|bay|university|college|ossington|bathurst)[^.,!?]*/i,
      /(downtown|scarborough|etobicoke|north york|york|east york)/i,
      /([a-z]\d[a-z]\s?\d[a-z]\d)/i, // Postal code
    ];
    
    // Search through all messages for location
    for (const msg of messages) {
      for (const pattern of locationPatterns) {
        const match = msg.content.match(pattern);
        if (match) {
          userLocation = match[1] || match[0];
          break;
        }
      }
      if (userLocation) break;
    }
    
    const hasLocation = userLocation.length > 0;
    
    let services = null;
    let queryEmbedding = null;
    
    // Only search for services if we have location
    if (hasLocation && messages.length > 2) { // More than just the initial greeting
      // Generate embedding for the user's query
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: latestMessage,
      });
      
      queryEmbedding = embeddingResponse.data[0].embedding;
      
      // Search for relevant services using location-aware search
      const { data: searchResults, error: searchError } = await supabase.rpc(
        'search_services_by_location',
        {
          query_embedding: queryEmbedding,
          user_location: userLocation,
          match_count: 10,
        }
      );
      
      if (searchError) {
        console.error('Search error:', searchError);
        throw searchError;
      }
      
      services = searchResults;
    }
    
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
    
    // Format services for context (not currently used but may be needed for future enhancements)
    // const servicesContext = services?.map((service: ServiceResult) => 
    //   `Service: ${service.title}...`
    // ).join('\n\n');
    
    // Create the prompt with service context
    const contextualPrompt = hasLocation 
      ? `Found ${services?.length || 0} relevant services for the user's location: ${userLocation}.

User message: "${latestMessage}"

${services?.length > 0 ? "Tell them you found services near their location. They will see the cards below." : "Let them know you're looking but haven't found specific matches yet."}

Remember: Do NOT list service details.`
      : `User has NOT provided location yet.

User message: "${latestMessage}"

You MUST ask for their location (neighborhood, intersection, or postal code) to help them find services.`;
    
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
    
    // Return a StreamingTextResponse with services in headers
    return new StreamingTextResponse(stream, {
      headers: {
        'X-Services': JSON.stringify(services || []),
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