import { ModernCards } from './ModernServiceStyles';

interface Service {
  id: string;
  title: string;
  category: string;
  description?: string;
  address_street?: string;
  address_city?: string;
  phone?: string;
  distance_km?: string;
  distance_meters?: number;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  services?: Service[];
  selectedServiceId?: string | null;
  onDetailsClick?: (service: Service) => void;
}

export function ChatMessage({ role, content, services, selectedServiceId, onDetailsClick }: ChatMessageProps) {
  const isUser = role === 'user';

  // Choose display style based on content or service type
  const getServiceDisplay = () => {
    if (!services || services.length === 0) return null;

    // Future enhancement: detect content type for different displays
    // const isUrgent = content.toLowerCase().includes('crisis');
    // const isFood = content.toLowerCase().includes('food');

    // Use ModernCards (crisis design) for all responses
    return <ModernCards 
      services={services} 
      selectedServiceId={selectedServiceId} 
      onDetailsClick={onDetailsClick} 
    />;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] space-y-3`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#1a1a1a] text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        {/* Services with dynamic styling */}
        {!isUser && services && services.length > 0 && (
          <div className="mt-3">
            {getServiceDisplay()}
          </div>
        )}
      </div>
    </div>
  );
}