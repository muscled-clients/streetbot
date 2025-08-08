import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface ServiceData {
  id: string;
  title: string;
  category: string;
  description?: string;
  eligibility?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
  };
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours_of_operation?: string;
  languages?: string[] | string;
  accessibility?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
}

let processedCount = 0;
let errorCount = 0;

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function updateDatabaseSchema() {
  console.log('📊 Updating database schema for UUID support...');
  
  // Add original_id column if it doesn't exist
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'services' 
          AND column_name = 'original_id'
        ) THEN
          ALTER TABLE services ADD COLUMN original_id TEXT;
          CREATE INDEX idx_services_original_id ON services(original_id);
        END IF;
      END $$;
    `
  });

  if (alterError) {
    // If RPC doesn't exist, try direct approach
    console.log('⚠️  Note: Could not add original_id column automatically.');
    console.log('   Please run this SQL in Supabase dashboard:');
    console.log('   ALTER TABLE services ADD COLUMN original_id TEXT;');
    console.log('   CREATE INDEX idx_services_original_id ON services(original_id);\n');
  } else {
    console.log('✅ Database schema updated\n');
  }
}

async function clearExistingServices() {
  console.log('🗑️  Clearing existing services from database...');
  const { error } = await supabase
    .from('services')
    .delete()
    .neq('id', '');
  
  if (error) {
    console.error('Error clearing services:', error);
    throw error;
  }
  console.log('✅ Database cleared\n');
}

async function processService(service: ServiceData) {
  // Generate a unique UUID for this service
  const uuid = randomUUID();
  
  // Create searchable text for embedding
  const searchableText = [
    service.title,
    service.category,
    service.description,
    service.eligibility,
    service.address?.city,
  ].filter(Boolean).join(' ');

  try {
    // Generate embedding
    const embedding = await generateEmbedding(searchableText);

    // Process languages
    let languagesArray: string[] = [];
    if (service.languages) {
      if (Array.isArray(service.languages)) {
        languagesArray = service.languages;
      } else if (typeof service.languages === 'string') {
        languagesArray = service.languages
          .split(',')
          .map(lang => lang.trim())
          .filter(lang => lang.length > 0);
      }
    }

    // Prepare data for insertion with UUID as primary key
    const serviceRecord = {
      id: uuid,  // Use UUID as primary key
      original_id: service.id,  // Keep original ID for reference
      title: service.title,
      category: service.category,
      description: service.description || null,
      eligibility: service.eligibility || null,
      address_street: service.address?.street || null,
      address_city: service.address?.city || null,
      address_province: service.address?.province || 'ON',
      phone: service.contact_info?.phone || null,
      email: service.contact_info?.email || null,
      website: service.contact_info?.website || null,
      hours_of_operation: service.hours_of_operation || null,
      languages: languagesArray,
      accessibility: service.accessibility || null,
      latitude: service.coordinates?.latitude || null,
      longitude: service.coordinates?.longitude || null,
      embedding: embedding,
    };

    // Insert into Supabase
    const { error } = await supabase
      .from('services')
      .insert(serviceRecord);

    if (error) {
      throw error;
    }

    processedCount++;
    console.log(`✅ Imported: ${service.title} [Original: ${service.id} → UUID: ${uuid}]`);
  } catch (error) {
    console.error(`❌ Failed: ${service.title} [${service.id}]:`, error);
    errorCount++;
  }
}

async function importServicesWithUUIDs() {
  console.log('🚀 Starting UUID-based service import...\n');
  console.log('This approach:');
  console.log('  • Generates a unique UUID for each service');
  console.log('  • Preserves original ID in a separate field');
  console.log('  • Ensures ALL 3,351 services are imported\n');

  // Ask for confirmation before clearing
  console.log('⚠️  This will clear all existing services and re-import with UUIDs.');
  console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Update schema if needed
  await updateDatabaseSchema();

  // Clear existing services
  await clearExistingServices();

  // Path to all_services.json
  const dataPath = path.join(__dirname, '../../client-data/data/all_services.json');
  
  // Read all services
  console.log('📁 Reading all_services.json...');
  const allServices: ServiceData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📊 Found ${allServices.length} total services\n`);

  // Count duplicates for reporting
  const idOccurrences = new Map<string, number>();
  allServices.forEach(s => {
    idOccurrences.set(s.id, (idOccurrences.get(s.id) || 0) + 1);
  });
  const duplicateCount = Array.from(idOccurrences.values()).filter(count => count > 1).reduce((sum, count) => sum + count - 1, 0);
  console.log(`📊 Original duplicate entries: ${duplicateCount}`);
  console.log(`📊 Unique original IDs: ${idOccurrences.size}\n`);

  // Process in batches
  const batchSize = 5;
  const delay = 2000;

  console.log('🔄 Starting import with UUIDs...\n');

  for (let i = 0; i < allServices.length; i += batchSize) {
    const batch = allServices.slice(i, i + batchSize);
    
    const promises = batch.map(service => processService(service));

    await Promise.all(promises);
    
    // Progress update
    if ((i + batchSize) % 50 === 0 || i + batchSize >= allServices.length) {
      const progress = Math.min(i + batchSize, allServices.length);
      const percentage = (progress / allServices.length * 100).toFixed(1);
      console.log(`\n📈 Progress: ${progress}/${allServices.length} (${percentage}%)`);
      console.log(`   - Processed: ${processedCount}`);
      console.log(`   - Errors: ${errorCount}\n`);
    }
    
    // Add delay between batches
    if (i + batchSize < allServices.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Final check
  const { count } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });
  
  console.log('\n🎉 Import completed!');
  console.log(`📊 Final statistics:`);
  console.log(`   - Total processed: ${processedCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total in database: ${count}/3351`);
  
  if (count === 3351) {
    console.log('\n✨ SUCCESS: All services imported with UUIDs!');
    console.log('   Each service now has:');
    console.log('   • A unique UUID as primary key');
    console.log('   • Original ID preserved in original_id field');
  } else {
    console.log(`\n⚠️  Warning: Expected 3351 services but got ${count}`);
  }

  // Show sample of how to query by original ID
  console.log('\n💡 Tip: You can still query by original ID:');
  console.log('   SELECT * FROM services WHERE original_id = \'65803212\';');
}

// Run the import
importServicesWithUUIDs().catch(console.error);