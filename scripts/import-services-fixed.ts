import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

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
let duplicateFixedCount = 0;
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

async function processService(service: ServiceData, uniqueId: string) {
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

    // Prepare data for insertion with the unique ID
    const serviceRecord = {
      id: uniqueId,
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
    if (uniqueId !== service.id) {
      duplicateFixedCount++;
      console.log(`✅ Imported (duplicate fixed): ${service.title} [${service.id} → ${uniqueId}]`);
    } else {
      console.log(`✅ Imported: ${service.title} [${uniqueId}]`);
    }
  } catch (error) {
    console.error(`❌ Failed: ${service.title} [${uniqueId}]:`, error);
    errorCount++;
  }
}

async function importServicesWithUniqueIds() {
  console.log('🚀 Starting fixed service import with unique ID handling...\n');

  // Ask for confirmation before clearing
  console.log('⚠️  This will clear all existing services and re-import with unique IDs.');
  console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Clear existing services
  await clearExistingServices();

  // Path to all_services.json
  const dataPath = path.join(__dirname, '../../client-data/data/all_services.json');
  
  // Read all services
  console.log('📁 Reading all_services.json...');
  const allServices: ServiceData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📊 Found ${allServices.length} total services\n`);

  // Track seen IDs and create unique IDs for duplicates
  const idCounter = new Map<string, number>();
  const servicesWithUniqueIds: Array<{ service: ServiceData; uniqueId: string }> = [];

  // First pass: assign unique IDs
  console.log('🔍 Processing IDs and fixing duplicates...');
  for (const service of allServices) {
    const originalId = service.id;
    let uniqueId = originalId;

    if (idCounter.has(originalId)) {
      // This is a duplicate - append counter
      const count = idCounter.get(originalId)! + 1;
      idCounter.set(originalId, count);
      uniqueId = `${originalId}_${count}`;
    } else {
      // First occurrence
      idCounter.set(originalId, 1);
    }

    servicesWithUniqueIds.push({ service, uniqueId });
  }

  // Report duplicate statistics
  const duplicateIds = Array.from(idCounter.entries()).filter(([_, count]) => count > 1);
  console.log(`📊 Found ${duplicateIds.length} IDs with duplicates`);
  console.log(`📊 Total duplicate entries: ${servicesWithUniqueIds.filter(s => s.uniqueId !== s.service.id).length}`);
  console.log();

  // Process in batches
  const batchSize = 5;
  const delay = 2000;

  console.log('🔄 Starting import with unique IDs...\n');

  for (let i = 0; i < servicesWithUniqueIds.length; i += batchSize) {
    const batch = servicesWithUniqueIds.slice(i, i + batchSize);
    
    const promises = batch.map(({ service, uniqueId }) => 
      processService(service, uniqueId)
    );

    await Promise.all(promises);
    
    // Progress update
    if ((i + batchSize) % 50 === 0 || i + batchSize >= servicesWithUniqueIds.length) {
      const progress = Math.min(i + batchSize, servicesWithUniqueIds.length);
      const percentage = (progress / servicesWithUniqueIds.length * 100).toFixed(1);
      console.log(`\n📈 Progress: ${progress}/${servicesWithUniqueIds.length} (${percentage}%)`);
      console.log(`   - Processed: ${processedCount}`);
      console.log(`   - Duplicates fixed: ${duplicateFixedCount}`);
      console.log(`   - Errors: ${errorCount}\n`);
    }
    
    // Add delay between batches
    if (i + batchSize < servicesWithUniqueIds.length) {
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
  console.log(`   - Duplicates fixed: ${duplicateFixedCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total in database: ${count}/3351`);
  
  if (count === 3351) {
    console.log('\n✨ SUCCESS: All services imported with unique IDs!');
  } else {
    console.log(`\n⚠️  Warning: Expected 3351 services but got ${count}`);
  }
}

// Run the import
importServicesWithUniqueIds().catch(console.error);