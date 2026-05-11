import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tflxwwafvozphnlfebab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbHh3d2Fmdm96cGhubGZlYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzc4ODYsImV4cCI6MjA5MzgxMzg4Nn0.Z_4JbykX_QM32qwpydPoWU7vC-4kCblnren9B-r2xCQ'
)

async function checkMemberId() {
  const { data, error } = await supabase.from('members').select('id, full_name').limit(1)
  console.log('Member data:', data)
  if (data && data[0]) {
    console.log('Trying to insert notification for this user...')
    const { error: insertError } = await supabase.from('notifications').insert([{
      title: 'Real-time Check',
      message: 'This is a test notification',
      user_id: data[0].id
    }])
    console.log('Insert Result:', insertError)
  }
}

checkMemberId()
