import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This secret should match your VERCEL_CRON_SECRET env var to prevent unauthorized calls
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Protect with Vercel's built-in cron secret
  if (process.env.NODE_ENV === 'production') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    // Perform a small update operation to keep the DB active
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'last_keep_alive_ping', 
        value: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Supabase Keep-Alive Ping Sent' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
