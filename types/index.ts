export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  eligibility?: string;
  address: {
    street: string;
    city: string;
    province: string;
  };
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours_of_operation?: string;
  languages?: string[];
  accessibility?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  embedding?: number[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}