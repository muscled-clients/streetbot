import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRealtime() {
  const { count } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);
  
  console.log(`Services with embeddings: ${count}`);
  console.log(`Percentage: ${((count || 0) / 3352 * 100).toFixed(1)}%`);
  console.log(`Remaining: ${3352 - (count || 0)}`);
}

checkRealtime().catch(console.error);