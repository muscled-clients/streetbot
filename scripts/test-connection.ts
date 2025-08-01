import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Check if env vars are loaded
  console.log('Environment check:');
  console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Missing ✗');
  console.log('- SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set ✓' : 'Missing ✗');
  console.log('- URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Test 1: Simple insert
    console.log('Test 1: Inserting a test service...');
    const testService = {
      id: 'test-123',
      title: 'Test Service',
      category: 'Test Category',
      description: 'This is a test service',
    };

    const { data, error } = await supabase
      .from('services')
      .insert(testService);

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Insert successful!');
    }

    // Test 2: Query the data
    console.log('\nTest 2: Querying services...');
    const { data: services, error: queryError } = await supabase
      .from('services')
      .select('*')
      .limit(5);

    if (queryError) {
      console.error('Query error:', queryError);
    } else {
      console.log(`Found ${services?.length || 0} services`);
    }

    // Clean up test data
    console.log('\nCleaning up test data...');
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', 'test-123');

    if (deleteError) {
      console.error('Delete error:', deleteError);
    } else {
      console.log('Cleanup successful!');
    }

  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();