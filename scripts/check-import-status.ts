import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkImportStatus() {
  console.log('Checking import status...\n');

  // 1. Count total JSON files
  const dataDir = path.join(__dirname, '../../client-data/data');
  const files = fs.readdirSync(dataDir).filter(file => 
    file.startsWith('service_') && file.endsWith('.json')
  );
  const totalFiles = files.length;
  console.log(`📁 Total service JSON files: ${totalFiles}`);

  // 2. Count services in database
  const { count: totalServices, error: countError } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting services:', countError);
    return;
  }

  console.log(`💾 Total services in database: ${totalServices || 0}`);

  // 3. Count services with embeddings
  const { count: servicesWithEmbeddings, error: embeddingError } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  if (embeddingError) {
    console.error('Error counting embeddings:', embeddingError);
    return;
  }

  console.log(`🧮 Services with embeddings: ${servicesWithEmbeddings || 0}`);

  // 4. Check for missing services
  const missingCount = totalFiles - (totalServices || 0);
  if (missingCount > 0) {
    console.log(`\n⚠️  Missing services: ${missingCount}`);
  } else {
    console.log(`\n✅ All services imported!`);
  }

  // 5. Check for missing embeddings
  const missingEmbeddings = (totalServices || 0) - (servicesWithEmbeddings || 0);
  if (missingEmbeddings > 0) {
    console.log(`⚠️  Services without embeddings: ${missingEmbeddings}`);
  } else {
    console.log(`✅ All services have embeddings!`);
  }

  // 6. Show completion percentage
  const importPercentage = ((totalServices || 0) / totalFiles * 100).toFixed(1);
  const embeddingPercentage = ((servicesWithEmbeddings || 0) / totalFiles * 100).toFixed(1);
  
  console.log(`\n📊 Import Progress:`);
  console.log(`   - Services imported: ${importPercentage}%`);
  console.log(`   - Embeddings generated: ${embeddingPercentage}%`);

  // 7. Sample check - show a few services by city
  console.log(`\n🏙️  Services by city (sample):`);
  const { data: cityCounts } = await supabase
    .from('services')
    .select('address_city')
    .not('address_city', 'is', null);

  if (cityCounts) {
    const cityMap = new Map<string, number>();
    cityCounts.forEach(s => {
      const city = s.address_city;
      cityMap.set(city, (cityMap.get(city) || 0) + 1);
    });

    const sortedCities = Array.from(cityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    sortedCities.forEach(([city, count]) => {
      console.log(`   - ${city}: ${count} services`);
    });
  }

  // 8. Check if import script is still running
  if (importPercentage !== '100.0') {
    console.log(`\n💡 Tip: Run 'npm run import-services' to continue importing`);
  }
}

checkImportStatus().catch(console.error);