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
  // const [messageServices, setMessageServices] = useState<Record<string, Service[]>>({});
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

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
    handleSubmit(e);
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
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={message.content}
              services={
                // Show services on the message that triggered them, not just the last one
                message.role === 'assistant' && services && services.length > 0 && index === messages.length - 1
                  ? services
                  : undefined
              }
            />
          ))}
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
      <form onSubmit={onSubmit} className="px-4 pb-4 bg-[#1a1a1a]">
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