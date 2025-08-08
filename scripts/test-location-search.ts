import { GeocodingService } from '../utils/geocoding';
import { TOTAL_CACHED_LOCATIONS } from '../utils/toronto-locations';
import { supabase } from '../lib/supabase/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testLocationSearch() {
  console.log('🗺️  Location Search Test Suite');
  console.log(`📍 Total cached locations: ${TOTAL_CACHED_LOCATIONS}\n`);

  // Test locations
  const testQueries = [
    "I need help near Yonge and Dundas",
    "Services at Yorkdale mall",
    "I'm at Trinity Bellwoods park",
    "Food banks near Scarborough Town Centre",
    "Shelters near Union Station",
    "Mental health services at CAMH Queen Street",
    "I'm at the Reference Library",
    "Services near Seneca College",
    "Help at Jane and Finch",
    "I'm near High Park station"
  ];

  console.log('🔍 Testing location detection:\n');
  
  for (const query of testQueries) {
    const location = GeocodingService.detectLocationIntent(query);
    
    if (location) {
      console.log(`✅ "${query}"`);
      console.log(`   → Found: ${location.address}`);
      console.log(`   → Coords: ${location.coordinates.lat}, ${location.coordinates.lng}`);
      
      // Test database search
      const { data, error } = await supabase.rpc('search_services_by_location', {
        user_lat: location.coordinates.lat,
        user_lng: location.coordinates.lng,
        radius_meters: 2000, // 2km
        max_results: 3
      });
      
      if (data && data.length > 0) {
        console.log(`   → Found ${data.length} services nearby:`);
        data.forEach((service: any, i: number) => {
          console.log(`     ${i+1}. ${service.title} (${service.distance_km})`);
        });
      } else if (error) {
        console.log(`   ❌ Database error: ${error.message}`);
      } else {
        console.log(`   → No services found within 2km`);
      }
    } else {
      console.log(`❌ "${query}"`);
      console.log(`   → Location not detected`);
    }
    console.log();
  }

  // Test some specific cached locations
  console.log('📍 Testing specific cached locations:\n');
  
  const specificTests = [
    'eaton centre',
    'camh queen street', 
    'regent park',
    'nathan phillips square',
    'dufferin mall',
    'george brown college'
  ];

  for (const loc of specificTests) {
    const location = GeocodingService.detectLocationIntent(`I'm at ${loc}`);
    console.log(`${loc}: ${location ? '✅ Found' : '❌ Not found'}`);
  }

  // Check database status
  const { count } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Database Status:`);
  console.log(`   Total services: ${count}/3351`);
  console.log(`   Import progress: ${Math.round((count || 0) / 3351 * 100)}%`);
}

testLocationSearch().catch(console.error);