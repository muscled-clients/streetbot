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
let skippedCount = 0;
let errorCount = 0;
let lastDatabaseCheck = Date.now();
let existingIds = new Set<string>();

async function updateExistingIds() {
  console.log('\n📊 Checking database status...');
  const { data: existingServices, error: fetchError } = await supabase
    .from('services')
    .select('id')
    .not('embedding', 'is', null);

  if (fetchError) {
    console.error('Error fetching existing services:', fetchError);
    return;
  }

  existingIds = new Set(existingServices?.map(s => s.id) || []);
  const totalInDb = existingIds.size;
  const percentage = (totalInDb / 3352 * 100).toFixed(1);
  
  console.log(`💾 Database status: ${totalInDb}/3352 services (${percentage}%)`);
  console.log(`✅ Processed this session: ${processedCount}`);
  console.log(`⏭️  Skipped (already exists): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⏳ Remaining: ${3352 - totalInDb}\n`);
  
  lastDatabaseCheck = Date.now();
}

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

async function processService(service: ServiceData, retries = 3) {
  // Skip if already exists
  if (existingIds.has(service.id)) {
    skippedCount++;
    return;
  }

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
    console.log(`🔄 Processing: ${service.title}`);
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

    // Prepare data for insertion
    const serviceRecord = {
      id: service.id,
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

    // Insert into Supabase with retry
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error } = await supabase
          .from('services')
          .upsert(serviceRecord, { onConflict: 'id' });

        if (error) {
          throw error;
        }

        console.log(`✅ Imported: ${service.title}`);
        processedCount++;
        existingIds.add(service.id);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.log(`🔁 Retry ${attempt}/${retries} for: ${service.title}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    console.error(`❌ Failed: ${service.title}:`, error);
    errorCount++;
  }
}

async function importServices() {
  console.log('🚀 Starting enhanced service import...\n');

  // Initial database check
  await updateExistingIds();

  // Path to the service data directory
  const dataDir = path.join(__dirname, '../../client-data/data');
  
  // Read all service files
  const files = fs.readdirSync(dataDir).filter(file => 
    file.startsWith('service_') && file.endsWith('.json')
  );

  console.log(`📁 Found ${files.length} service files total\n`);

  // Process in batches
  const batchSize = 5;
  const delay = 2000;

  for (let i = 0; i < files.length; i += batchSize) {
    // Check if we should update database status (every 30 seconds)
    if (Date.now() - lastDatabaseCheck > 30000) {
      await updateExistingIds();
    }

    const batch = files.slice(i, i + batchSize);
    const promises = batch.map(async (file) => {
      const serviceId = file.replace('service_', '').replace('.json', '');
      
      // Skip if already exists
      if (existingIds.has(serviceId)) {
        skippedCount++;
        return;
      }

      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      await processService(data);
    });

    await Promise.all(promises);
    
    // Progress update
    if ((i + batchSize) % 50 === 0 || i + batchSize >= files.length) {
      console.log(`\n📈 Progress: ${i + batchSize}/${files.length} files processed`);
    }
    
    // Add delay between batches
    if (i + batchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Final database check
  await updateExistingIds();
  
  console.log('\n🎉 Import completed!');
  console.log(`📊 Final stats:`);
  console.log(`   - Total processed: ${processedCount}`);
  console.log(`   - Total skipped: ${skippedCount}`);
  console.log(`   - Total errors: ${errorCount}`);
  console.log(`   - Total in database: ${existingIds.size}/3352`);
}

// Run the import
importServices().catch(console.error);