import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tflxwwafvozphnlfebab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbHh3d2Fmdm96cGhubGZlYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzc4ODYsImV4cCI6MjA5MzgxMzg4Nn0.Z_4JbykX_QM32qwpydPoWU7vC-4kCblnren9B-r2xCQ'
)

async function testNotifications() {
  console.log('Testing notifications table...')
  const { data, error } = await supabase.from('notifications').select('*').limit(1)
  
  if (error) {
    console.error('Select Error:', JSON.stringify(error, null, 2))
  } else {
    console.log('Select Success:', data)
    
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]))
    } else {
      console.log('Table is empty. Trying to insert a test row...')
      const { error: insertError } = await supabase.from('notifications').insert([{
        title: 'Test',
        message: 'Test message',
        user_id: '15996705518239280238' // dummy id
      }])
      console.log('Insert Test Error:', JSON.stringify(insertError, null, 2))
    }
  }
}

testNotifications()
