import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to query the services table
    const { data, error, count } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Connected to Supabase!',
      tableExists: true,
      rowCount: count || 0
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect',
      details: error
    }, { status: 500 });
  }
}