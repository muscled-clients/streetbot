// Modern Style 1: Horizontal Scroll Cards with Actions
interface ModernCardsProps {
  services: any[];
  selectedServiceId?: string | null;
  onDetailsClick?: (service: any) => void;
}

export function ModernCards({ services, selectedServiceId, onDetailsClick }: ModernCardsProps) {
  return (
    <div className="mt-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`min-w-[300px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-4 border transition-all hover:shadow-lg ${
              selectedServiceId === service.id 
                ? 'border-[#FFD700] shadow-lg shadow-[#FFD700]/20' 
                : 'border-gray-800 hover:border-[#FFD700] hover:shadow-[#FFD700]/10'
            }`}
          >
            <div className="mb-3">
              <h4 className="text-white font-semibold line-clamp-2">{service.title}</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="text-gray-400">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    {service.address_street && (
                      <div className="line-clamp-1">{service.address_street}</div>
                    )}
                    <div className="text-xs">{service.address_city || 'Toronto, ON'}</div>
                  </div>
                </div>
              </div>
              
              {service.distance_km && (
                <div className="flex items-center gap-2 text-[#FFD700]">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="font-medium">
                    {service.distance_meters && service.distance_meters < 1000 
                      ? `${Math.round(service.distance_meters / 10) * 10} meters` 
                      : service.distance_km} away
                    {service.distance_meters && service.distance_meters <= 2000 && (
                      <span className="text-gray-400 text-xs ml-1">
                        (~{Math.round(service.distance_meters / 80)} min walk)
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {service.phone && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{service.phone}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              {service.phone && (
                <a 
                  href={`tel:${service.phone}`}
                  className="flex-1 bg-[#FFD700] text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors text-center"
                >
                  Call Now
                </a>
              )}
              <a 
                href={service.latitude && service.longitude 
                  ? `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`
                  : `https://www.google.com/maps/search/${encodeURIComponent(service.address_street || service.title)},+Toronto,+ON`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                title="Get directions in Google Maps"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Maps
              </a>
              <button 
                onClick={() => {
                  if (onDetailsClick) {
                    onDetailsClick(service);
                  } else {
                    // Fallback to old behavior if no callback provided
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (input) {
                      input.value = `Tell me more about ${service.title}`;
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                      // Trigger form submit
                      const form = input.closest('form');
                      if (form) {
                        form.requestSubmit();
                      }
                    }
                  }
                }}
                className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg text-sm font-medium border border-gray-700 hover:border-[#FFD700] transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modern Style 2: Minimal List with Quick Actions
export function ModernList({ services }: { services: any[] }) {
  return (
    <div className="mt-4 bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[#FFD700] font-semibold">Found {services.length} services</h4>
        <span className="text-xs text-gray-500">Sorted by relevance</span>
      </div>
      
      <div className="space-y-2">
        {services.slice(0, 5).map((service, index) => (
          <div key={service.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors group">
            <div className="w-8 h-8 bg-[#FFD700]/10 rounded-full flex items-center justify-center text-[#FFD700] font-semibold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-medium truncate">{service.title}</h5>
              <p className="text-gray-500 text-sm truncate">
                {service.address_city} 
                {service.distance_meters ? 
                  `• ${service.distance_meters < 1000 ? 
                    `${Math.round(service.distance_meters / 10) * 10} meters` : 
                    service.distance_km}` : ''}
                {service.distance_meters && service.distance_meters <= 2000 ? ` (${Math.round(service.distance_meters / 80)} min walk)` : ''}
                • {service.phone || 'No phone'}
              </p>
            </div>
            
            <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#FFD700] text-black px-4 py-1.5 rounded-full text-sm font-medium">
              Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modern Style 3: Chat Bubble with Embedded Cards
export function ModernBubble({ services }: { services: any[] }) {
  return (
    <div className="mt-3">
      <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-none p-4 max-w-lg">
        <p className="text-gray-300 text-sm mb-3">
          I found {services.length} services that can help you:
        </p>
        
        <div className="space-y-2">
          {services.slice(0, 3).map((service) => (
            <div key={service.id} className="bg-black/50 rounded-xl p-3 border border-gray-800">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h5 className="text-[#FFD700] font-medium text-sm line-clamp-1">
                    {service.title}
                  </h5>
                  <p className="text-gray-400 text-xs mt-1">
                    {service.address_city} 
                    {service.distance_meters ? 
                      `• ${service.distance_meters < 1000 ? 
                        `${Math.round(service.distance_meters / 10) * 10} meters` : 
                        service.distance_km}` : ''}
                    {service.distance_meters && service.distance_meters <= 2000 ? ` (${Math.round(service.distance_meters / 80)} min)` : ''}
                  </p>
                </div>
                {service.phone && (
                  <a
                    href={`tel:${service.phone}`}
                    className="bg-[#FFD700]/10 text-[#FFD700] p-2 rounded-lg hover:bg-[#FFD700]/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {services.length > 3 && (
          <button className="text-[#FFD700] text-sm mt-3 hover:underline">
            Show {services.length - 3} more →
          </button>
        )}
      </div>
    </div>
  );
}

// Modern Style 4: Horizontal Scroll Cards
export function ModernScroll({ services }: { services: any[] }) {
  return (
    <div className="mt-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {services.map((service) => (
          <div key={service.id} className="min-w-[280px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-4 border border-gray-800">
            <div className="mb-3">
              <span className="text-[#FFD700] text-xs font-semibold uppercase tracking-wider">
                {service.category}
              </span>
              <h4 className="text-white font-semibold mt-1 line-clamp-2">
                {service.title}
              </h4>
            </div>
            
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <div>
                <span className="text-[#FFD700] mr-2">📍</span>
                {service.address_street && (
                  <span className="block ml-6">{service.address_street}</span>
                )}
                <span className="block ml-6 text-xs">{service.address_city || 'Toronto, ON'}</span>
              </div>
              {service.distance_km && (
                <p className="flex items-center gap-2">
                  <span className="text-[#FFD700]">🚶</span>
                  {service.distance_meters && service.distance_meters < 1000 
                    ? `${Math.round(service.distance_meters / 10) * 10} meters` 
                    : service.distance_km} away
                  {service.distance_meters && service.distance_meters <= 2000 && (
                    <span className="text-gray-400 text-xs">
                      ({Math.round(service.distance_meters / 80)} min walk)
                    </span>
                  )}
                </p>
              )}
              {service.phone && (
                <p className="flex items-center gap-2">
                  <span className="text-[#FFD700]">📞</span>
                  {service.phone}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-[#FFD700] text-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-500 transition-colors">
                Details
              </button>
              {(service.latitude && service.longitude) && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl font-medium border border-gray-700 hover:border-[#FFD700] transition-colors flex items-center justify-center"
                  title="Get directions"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modern Style 5: Interactive Map Cards
export function ModernMap({ services }: { services: any[] }) {
  return (
    <div className="mt-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold">Nearby Services</h4>
        <button className="text-[#FFD700] text-sm hover:underline">
          Open Map →
        </button>
      </div>
      
      <div className="grid gap-3">
        {services.slice(0, 3).map((service, index) => (
          <div key={service.id} className="flex gap-3 items-start">
            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">
              {String.fromCharCode(65 + index)}
            </div>
            
            <div className="flex-1">
              <h5 className="text-white font-medium">{service.title}</h5>
              <div className="text-gray-400 text-sm">
                {service.address_street && (
                  <div>{service.address_street}</div>
                )}
                <div className="text-xs">{service.address_city || 'Toronto, ON'}</div>
              </div>
              <div className="flex gap-3 mt-2">
                {(service.latitude && service.longitude) && (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFD700] text-sm hover:underline"
                  >
                    Directions
                  </a>
                )}
                {service.phone && (
                  <button className="text-[#FFD700] text-sm hover:underline">
                    Call
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}