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
  languages?: string[] | string; // Can be array or comma-separated string
  accessibility?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
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

async function processService(service: ServiceData, index: number, retries = 3) {
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
    console.log(`[${index}] Generating embedding for: ${service.title}`);
    const embedding = await generateEmbedding(searchableText);

    // Process languages - convert string to array if needed
    let languagesArray: string[] = [];
    if (service.languages) {
      if (Array.isArray(service.languages)) {
        languagesArray = service.languages;
      } else if (typeof service.languages === 'string') {
        // Split by comma and clean up
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

        console.log(`[${index}] Successfully imported: ${service.title}`);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.log(`[${index}] Retry ${attempt}/${retries} for: ${service.title}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    console.error(`[${index}] Failed to process ${service.title}:`, error);
    // Don't throw - continue with other services
  }
}

async function importServices() {
  console.log('Starting service import...');

  // Path to the service data directory
  const dataDir = path.join(__dirname, '../../client-data/data');
  
  // Read all service files
  const files = fs.readdirSync(dataDir).filter(file => 
    file.startsWith('service_') && file.endsWith('.json')
  );

  console.log(`Found ${files.length} service files to import`);

  // Check which services already exist
  console.log('Checking existing services...');
  const { data: existingServices, error: fetchError } = await supabase
    .from('services')
    .select('id')
    .not('embedding', 'is', null);

  if (fetchError) {
    console.error('Error fetching existing services:', fetchError);
    return;
  }

  const existingIds = new Set(existingServices?.map(s => s.id) || []);
  console.log(`Found ${existingIds.size} services already imported with embeddings`);

  // Filter out already imported files
  const filesToImport = files.filter(file => {
    const serviceId = file.replace('service_', '').replace('.json', '');
    return !existingIds.has(serviceId);
  });

  console.log(`${filesToImport.length} services need to be imported`);

  // Process in batches to avoid rate limits
  const batchSize = 5; // Reduced batch size
  const delay = 2000; // 2 second delay between batches

  for (let i = 0; i < filesToImport.length; i += batchSize) {
    const batch = filesToImport.slice(i, i + batchSize);
    const promises = batch.map(async (file, batchIndex) => {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      await processService(data, existingIds.size + i + batchIndex + 1);
    });

    await Promise.all(promises);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < filesToImport.length) {
      console.log(`Completed batch ${Math.floor(i / batchSize) + 1}, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  if (filesToImport.length === 0) {
    console.log('All services are already imported!');
  }

  console.log('Import completed successfully!');
}

// Run the import
importServices().catch(console.error);