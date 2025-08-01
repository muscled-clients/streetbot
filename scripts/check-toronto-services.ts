import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTorontoServices() {
  console.log('Checking Toronto services...\n');

  // Count Toronto services
  const torontoCities = ['Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York'];
  
  for (const city of torontoCities) {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('address_city', city);

    if (!error) {
      console.log(`${city}: ${count || 0} services`);
    }
  }

  // Show total GTA services
  const { count: gtaTotal } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .in('address_city', torontoCities);

  console.log(`\nTotal Toronto/GTA services: ${gtaTotal || 0}`);

  // Sample some Toronto food services
  console.log('\nSample Toronto food services:');
  const { data: foodServices } = await supabase
    .from('services')
    .select('title, address_city, category')
    .eq('address_city', 'Toronto')
    .ilike('category', '%food%')
    .limit(5);

  if (foodServices && foodServices.length > 0) {
    foodServices.forEach(s => {
      console.log(`- ${s.title} (${s.category})`);
    });
  } else {
    console.log('No Toronto food services found!');
  }
}

checkTorontoServices().catch(console.error);