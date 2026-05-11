
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tflxwwafvozphnlfebab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbHh3d2Fmdm96cGhubGZlYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzc4ODYsImV4cCI6MjA5MzgxMzg4Nn0.Z_4JbykX_QM32qwpydPoWU7vC-4kCblnren9B-r2xCQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testNotifications() {
  console.log('Checking notifications table schema...');
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error checking notifications:', error.message);
  } else {
    console.log('Notifications table columns:', data.length > 0 ? Object.keys(data[0]) : 'No data to check columns');
    
    // Try a dry run insert (if possible) or just check metadata
    if (data.length === 0) {
        // Try to insert a dummy notification to see if it works
        const { error: insError } = await supabase
            .from('notifications')
            .insert([{ user_id: 'a539aa25-6cfe-48d8-aa4d-67a5b78c4d3e', title: 'Test', message: 'Test message', type: 'SUCCESS' }]);
            
        if (insError) {
            console.error('FAILED to insert with type: SUCCESS. Error:', insError.message);
        } else {
            console.log('SUCCESS: Inserted with type column.');
        }
    }
  }
}

testNotifications();
