import { GeocodingService } from '../utils/geocoding';
import { getAllLocations } from '../utils/toronto-locations';
import { supabase } from '../lib/supabase/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function debugLocationIssue() {
  console.log('🔍 DEBUGGING LOCATION ISSUE\n');
  console.log('=' .repeat(50));

  // Test 1: Check if cache is loaded
  console.log('\n1️⃣ CACHE STATUS:');
  const cache = getAllLocations();
  console.log(`   Total locations in cache: ${cache.size}`);
  console.log(`   Kipling station in cache: ${cache.has('kipling station')}`);
  if (cache.has('kipling station')) {
    console.log(`   Kipling coordinates: ${JSON.stringify(cache.get('kipling station'))}`);
  }

  // Test 2: Test location detection
  console.log('\n2️⃣ LOCATION DETECTION:');
  const testPhrases = [
    'near kipling station',
    'kipling station',
    'at kipling station',
    'I need help near kipling station',
    'yonge and dundas',
    'near yonge and dundas'
  ];

  for (const phrase of testPhrases) {
    const result = GeocodingService.detectLocationIntent(phrase);
    console.log(`   "${phrase}"`);
    if (result) {
      console.log(`   ✅ Detected: ${result.address} (${result.coordinates.lat}, ${result.coordinates.lng})`);
    } else {
      console.log(`   ❌ NOT detected`);
    }
  }

  // Test 3: Check database connection
  console.log('\n3️⃣ DATABASE CONNECTION:');
  try {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`   ❌ Database error: ${error.message}`);
    } else {
      console.log(`   ✅ Connected - ${count} services in database`);
    }
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err}`);
  }

  // Test 4: Test RPC function with Kipling coordinates
  console.log('\n4️⃣ RPC FUNCTION TEST (Kipling Station):');
  const kiplingCoords = { lat: 43.6373, lng: -79.5362 };
  
  try {
    const { data, error } = await supabase.rpc('search_services_by_location', {
      user_lat: kiplingCoords.lat,
      user_lng: kiplingCoords.lng,
      radius_meters: 5000,
      max_results: 5
    });

    if (error) {
      console.log(`   ❌ RPC error: ${error.message}`);
      console.log(`   Error details: ${JSON.stringify(error, null, 2)}`);
    } else if (data && data.length > 0) {
      console.log(`   ✅ Found ${data.length} services near Kipling:`);
      data.forEach((s: any, i: number) => {
        console.log(`      ${i+1}. ${s.title} (${s.distance_km})`);
      });
    } else {
      console.log(`   ⚠️  No services found within 5km of Kipling`);
    }
  } catch (err) {
    console.log(`   ❌ RPC call failed: ${err}`);
  }

  // Test 5: Check if location column exists
  console.log('\n5️⃣ POSTGIS SETUP CHECK:');
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, latitude, longitude, location')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Column check error: ${error.message}`);
      if (error.message.includes('location')) {
        console.log(`   ⚠️  'location' column might not exist!`);
      }
    } else if (data && data.length > 0) {
      const sample = data[0];
      console.log(`   ✅ Columns exist`);
      console.log(`   Sample: lat=${sample.latitude}, lng=${sample.longitude}, location=${sample.location ? 'SET' : 'NULL'}`);
    }
  } catch (err) {
    console.log(`   ❌ Query failed: ${err}`);
  }

  // Test 6: Count services with valid locations
  console.log('\n6️⃣ LOCATION DATA STATUS:');
  try {
    const { count: totalCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    const { count: withLocation } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .not('location', 'is', null);
    
    const { count: withLatLng } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    console.log(`   Total services: ${totalCount}`);
    console.log(`   With location column: ${withLocation}`);
    console.log(`   With lat/lng: ${withLatLng}`);
    
    if (withLocation === 0 && withLatLng! > 0) {
      console.log(`   ⚠️  Location column not populated! Need to run PostGIS setup.`);
    }
  } catch (err) {
    console.log(`   ❌ Count query failed: ${err}`);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🔍 DEBUG COMPLETE\n');
}

debugLocationIssue().catch(console.error);