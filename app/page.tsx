'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from 'ai/react';
// import { ServiceCard } from '@/components/ServiceCard';
// import { ServiceDisplay } from '@/components/ServiceDisplay';
import { ChatMessage } from '@/components/ChatMessage';

export default function Home() {
  interface Service {
    id: string;
    title: string;
    category: string;
    description?: string;
    address_street?: string;
    address_city?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours_of_operation?: string;
    languages?: string[];
    accessibility?: string;
    distance_km?: string;
    distance_meters?: number;
  }

  const [services, setServices] = useState<Service[]>([]);
  const [messageServicesMap, setMessageServicesMap] = useState<Map<string, Service[]>>(new Map());
  const [serviceMessageOrder, setServiceMessageOrder] = useState<string[]>([]); // Track order for FIFO
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [lastUserQuery, setLastUserQuery] = useState<string>(''); // Track user's query for category detection
  const MAX_SERVICE_SETS = 5; // Keep maximum 5 sets of services
  // const [messageServices, setMessageServices] = useState<Record<string, Service[]>>({});
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi there! I'm StreetBot, and I'm here to help you find essential services in the Greater Toronto Area. Whether you need food, shelter, healthcare, or any other support, I'm here to listen and help connect you with the right resources. What can I help you with today?",
      },
    ],
    body: {
      userLocation: userLocation,
    },
    onResponse: (response) => {
      // Extract services from headers
      const servicesHeader = response.headers.get('X-Services');
      if (servicesHeader) {
        try {
          const parsedServices = JSON.parse(servicesHeader);
          setServices(parsedServices);
          
          // Only store services if they're new (different from ALL existing sets)
          if (parsedServices.length > 0) {
            // Check if user is asking for a different category
            const isDifferentCategory = () => {
              // Service category keywords
              const categories = {
                food: ['food', 'meal', 'hunger', 'hungry', 'eat', 'nutrition', 'food bank', 'pantry'],
                shelter: ['shelter', 'housing', 'homeless', 'sleep', 'bed', 'stay', 'accommodation'],
                health: ['health', 'medical', 'doctor', 'clinic', 'hospital', 'healthcare', 'nurse'],
                mental: ['mental', 'counseling', 'therapy', 'crisis', 'support', 'wellness'],
                legal: ['legal', 'lawyer', 'law', 'rights', 'court', 'justice'],
                employment: ['job', 'work', 'employment', 'career', 'resume', 'training']
              };
              
              // Detect category from user query
              let queryCategory = null;
              for (const [cat, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => lastUserQuery.includes(keyword))) {
                  queryCategory = cat;
                  break;
                }
              }
              
              // If we detected a category and have previous services, check if it's different
              if (queryCategory && serviceMessageOrder.length > 0) {
                // This is a different category request, always accept new services
                console.log(`User asking for ${queryCategory} services - accepting as new set`);
                return true;
              }
              
              return false;
            };
            
            // Check if these services are substantially different from existing ones
            const areServicesDifferent = () => {
              // First check if it's a different category request
              if (isDifferentCategory()) return true;
              
              // Get the most recent service set
              const recentServices = serviceMessageOrder.length > 0 
                ? messageServicesMap.get(serviceMessageOrder[serviceMessageOrder.length - 1]) 
                : null;
              
              if (!recentServices) return true;
              
              // Create sets of IDs for comparison
              const newServiceIds = new Set(parsedServices.map((s: Service) => s.id));
              const recentServiceIds = new Set(recentServices.map(s => s.id));
              
              // Count how many services match
              let matchingCount = 0;
              newServiceIds.forEach(id => {
                if (recentServiceIds.has(id)) matchingCount++;
              });
              
              // If less than 50% match, these are new services
              const matchPercentage = matchingCount / parsedServices.length;
              return matchPercentage < 0.5;
            };
            
            // If services are different, prepare to add them to a new message
            if (areServicesDifferent()) {
              console.log('New services detected, will attach to next assistant message');
              // Services will be attached when the message arrives
              // Clear any selected service highlighting
              setSelectedServiceId(null);
            } else {
              console.log('Similar services returned, not creating new set');
            }
          }
        } catch (e) {
          console.error('Failed to parse services:', e);
        }
      }
    },
    onFinish: () => {
      // Focus input after response
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    // Keep input focused when not loading
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log('User location detected:', position.coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Location access denied. Please provide your location when asking for services.');
          } else {
            setLocationError('Unable to detect location. Please provide your location when asking for services.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation not supported. Please provide your location when asking for services.');
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Store the user's query to detect category changes
    setLastUserQuery(input.toLowerCase());
    handleSubmit(e);
  };

  // Handle Details button click
  const handleDetailsClick = (service: Service) => {
    // Set the selected service for highlighting
    setSelectedServiceId(service.id);
    
    // Fill the input with the details request
    const detailsMessage = `Tell me more about ${service.title}`;
    setInput(detailsMessage);
    
    // Auto-submit after a brief delay so user sees the text
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#FFD700]">StreetBot</h1>
              <p className="text-[#999999] text-sm mt-1">
                Find essential services in the Greater Toronto Area
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#666666] text-xs">A tool by</p>
              <p className="text-[#999999] text-sm font-medium">StreetVoices.ca</p>
              {userLocation && (
                <p className="text-[#666666] text-xs mt-1">📍 Location detected</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages - Option 2: Inline Services */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            // Determine which services to show
            let servicesToShow = undefined;
            
            // Check if this message has services in the Map
            if (messageServicesMap.has(message.id)) {
              servicesToShow = messageServicesMap.get(message.id);
            } else if (message.role === 'assistant' && services.length > 0 && index === messages.length - 1) {
              // This is a new assistant message with services to attach
              const isDifferentCategory = () => {
                const categories = {
                  food: ['food', 'meal', 'hunger', 'hungry', 'eat', 'nutrition', 'food bank', 'pantry'],
                  shelter: ['shelter', 'housing', 'homeless', 'sleep', 'bed', 'stay', 'accommodation'],
                  health: ['health', 'medical', 'doctor', 'clinic', 'hospital', 'healthcare', 'nurse'],
                  mental: ['mental', 'counseling', 'therapy', 'crisis', 'support', 'wellness'],
                  legal: ['legal', 'lawyer', 'law', 'rights', 'court', 'justice'],
                  employment: ['job', 'work', 'employment', 'career', 'resume', 'training']
                };
                
                let queryCategory = null;
                for (const [cat, keywords] of Object.entries(categories)) {
                  if (keywords.some(keyword => lastUserQuery.includes(keyword))) {
                    queryCategory = cat;
                    break;
                  }
                }
                
                if (queryCategory && serviceMessageOrder.length > 0) {
                  return true;
                }
                return false;
              };
              
              const areServicesDifferent = () => {
                // First check if it's a different category request
                if (isDifferentCategory()) return true;
                
                const recentServices = serviceMessageOrder.length > 0 
                  ? messageServicesMap.get(serviceMessageOrder[serviceMessageOrder.length - 1]) 
                  : null;
                
                if (!recentServices) return true;
                
                const newServiceIds = new Set(services.map(s => s.id));
                const recentServiceIds = new Set(recentServices.map(s => s.id));
                
                let matchingCount = 0;
                newServiceIds.forEach(id => {
                  if (recentServiceIds.has(id)) matchingCount++;
                });
                
                const matchPercentage = matchingCount / services.length;
                return matchPercentage < 0.5;
              };
              
              // Only attach if these are new services
              if (areServicesDifferent()) {
                servicesToShow = services;
                
                // Update the Map and order tracking
                setTimeout(() => {
                  setMessageServicesMap(prev => {
                    const newMap = new Map(prev);
                    newMap.set(message.id, services);
                    
                    // Remove oldest if we exceed limit
                    if (newMap.size > MAX_SERVICE_SETS && serviceMessageOrder.length >= MAX_SERVICE_SETS) {
                      const oldestMessageId = serviceMessageOrder[0];
                      newMap.delete(oldestMessageId);
                    }
                    
                    return newMap;
                  });
                  
                  setServiceMessageOrder(prev => {
                    const newOrder = [...prev, message.id];
                    // Keep only the last MAX_SERVICE_SETS entries
                    if (newOrder.length > MAX_SERVICE_SETS) {
                      return newOrder.slice(-MAX_SERVICE_SETS);
                    }
                    return newOrder;
                  });
                }, 0);
              }
            }
            
            return (
              <ChatMessage
                key={message.id}
                role={message.role as 'user' | 'assistant'}
                content={message.content}
                services={servicesToShow}
                selectedServiceId={selectedServiceId}
                onDetailsClick={handleDetailsClick}
              />
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Services Display - Option 1: Separate Section (Commented out for Option 2) */}
      {/* {services.length > 0 && (
        <ServiceDisplay services={services} />
      )} */}

      {/* Quick Actions - Only show if no user messages yet */}
      {messages.filter(m => m.role === 'user').length === 0 && (
        <div className="px-4 py-3 bg-[#1a1a1a] border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => setInput("I need food")}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-button text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                🍲 Food
              </button>
              <button
                onClick={() => setInput("I need shelter")}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-button text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                🏠 Shelter
              </button>
              <button
                onClick={() => setInput("I'm in crisis and need help")}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-button text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                🆘 Crisis Help
              </button>
              <button
                onClick={() => setInput("I need healthcare")}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-button text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                🏥 Healthcare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form ref={formRef} onSubmit={onSubmit} className="px-4 pb-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 bg-[#000000] text-white px-4 py-3 rounded-button border border-gray-700 focus:border-[#FFD700] focus:outline-none transition-colors placeholder:text-[#999999]"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-[#FFD700] text-black rounded-button font-medium hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          {/* Footer */}
          <div className="mt-3 text-center">
            <p className="text-[#666666] text-xs">
              Built by{' '}
              <a 
                href="https://www.linkedin.com/in/roadtocode/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#FFD700] transition-colors"
              >
                Muscled Inc.
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}