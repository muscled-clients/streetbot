import { getAllLocations, TOTAL_CACHED_LOCATIONS } from './toronto-locations';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContext {
  coordinates: Coordinates;
  address: string;
  searchRadius: number;
}

export class GeocodingService {
  // Use comprehensive Toronto locations cache (300+ locations)
  private static LOCATION_CACHE: Map<string, Coordinates> = getAllLocations();
  
  // Keep old name for backward compatibility but use new cache
  private static INTERSECTION_CACHE: Map<string, Coordinates> = GeocodingService.LOCATION_CACHE;
  
  static {
    console.log(`GeocodingService initialized with ${TOTAL_CACHED_LOCATIONS} cached Toronto locations`);
  }
  

  static detectLocationIntent(message: string): LocationContext | null {
    const lowercaseMessage = message.toLowerCase().trim();
    
    // First, try direct lookup - if the entire message is just a location
    if (this.LOCATION_CACHE.has(lowercaseMessage)) {
      const coords = this.LOCATION_CACHE.get(lowercaseMessage)!;
      console.log(`Direct location match: ${lowercaseMessage}`);
      return {
        coordinates: coords,
        address: lowercaseMessage,
        searchRadius: 5000
      };
    }
    
    // Check for simple patterns like "kipling station" or "yonge dundas"
    const words = lowercaseMessage.split(/\s+/);
    if (words.length === 2) {
      // Try exact match first
      if (this.LOCATION_CACHE.has(lowercaseMessage)) {
        const coords = this.LOCATION_CACHE.get(lowercaseMessage)!;
        console.log(`Direct match for: ${lowercaseMessage}`);
        return {
          coordinates: coords,
          address: lowercaseMessage,
          searchRadius: 5000
        };
      }
      
      // Try with "and" between words
      const withAnd = `${words[0]} and ${words[1]}`;
      if (this.LOCATION_CACHE.has(withAnd)) {
        const coords = this.LOCATION_CACHE.get(withAnd)!;
        console.log(`Intersection match: ${withAnd}`);
        return {
          coordinates: coords,
          address: withAnd,
          searchRadius: 5000
        };
      }
    }
    
    // Patterns to detect location mentions in longer messages
    const locationPatterns = [
      /(?:near|at|around|in)\s+([^,\.]+)/i,  // Simple "near kipling station"
      /(?:i'?m |i am |located )(?:at |near |around )?([^,\.]+)/i,
      /(?:services |help |resources |shelters? |food banks? )(?:near |around |at |in )([^,\.]+)/i,
      /(?:closest |nearest |nearby )(.*?)(?:to |from |at |near )([^,\.]+)/i,
    ];

    for (const pattern of locationPatterns) {
      const match = message.match(pattern);
      if (match) {
        const location = (match[1] || match[2] || '').trim().toLowerCase();
        
        // Check cache first
        if (this.INTERSECTION_CACHE.has(location)) {
          const coords = this.INTERSECTION_CACHE.get(location)!;
          return {
            coordinates: coords,
            address: location,
            searchRadius: 5000 // Default 5km
          };
        }

        // Try to find partial matches in cache
        for (const [key, coords] of this.INTERSECTION_CACHE.entries()) {
          if (location.includes(key) || key.includes(location)) {
            return {
              coordinates: coords,
              address: key,
              searchRadius: 5000
            };
          }
        }
      }
    }

    return null;
  }

  static extractRadiusPreference(message: string): number {
    // Extract radius preferences from message
    const radiusPatterns = [
      /within (\d+)\s*(?:km|kilometer|kilometres)/i,
      /(\d+)\s*(?:km|kilometer|kilometres) radius/i,
      /walking distance/i, // Implies ~2km
      /very close/i, // Implies ~1km
      /nearby/i, // Implies ~3km
    ];

    if (/walking distance|very close/i.test(message)) {
      return 2000; // 2km for walking distance
    }
    
    if (/nearby|close/i.test(message)) {
      return 3000; // 3km for nearby
    }

    const match = message.match(/within (\d+)\s*(?:km|kilometer|kilometres)/i);
    if (match) {
      return Math.min(parseInt(match[1]) * 1000, 20000); // Max 20km
    }

    return 5000; // Default 5km
  }

  static formatLocationResponse(services: any[], location: LocationContext): string {
    if (services.length === 0) {
      return `No services found within ${location.searchRadius / 1000}km of ${location.address}. Try expanding your search radius or searching city-wide.`;
    }

    const header = `Found ${services.length} services near ${location.address}:\n\n`;
    const serviceList = services.map((service, index) => {
      return `${index + 1}. **${service.title}** (${service.distance_km})\n` +
             `   Category: ${service.category}\n` +
             `   Address: ${service.address_street}, ${service.address_city}\n` +
             (service.phone ? `   Phone: ${service.phone}\n` : '') +
             (service.website ? `   Website: ${service.website}\n` : '');
    }).join('\n');

    return header + serviceList;
  }

  // Expand search if too few results
  static async progressiveSearch(
    supabase: any,
    coordinates: Coordinates,
    minResults: number = 5
  ): Promise<any[]> {
    const radiusSteps = [1000, 2500, 5000, 10000, 20000]; // meters
    
    for (const radius of radiusSteps) {
      const { data, error } = await supabase.rpc('search_services_by_location', {
        user_lat: coordinates.lat,
        user_lng: coordinates.lng,
        radius_meters: radius,
        max_results: 20
      });

      if (!error && data && data.length >= minResults) {
        console.log(`Found ${data.length} services within ${radius/1000}km`);
        return data;
      }
    }

    return [];
  }
}

export { Coordinates, LocationContext };