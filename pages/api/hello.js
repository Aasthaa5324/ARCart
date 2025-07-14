// pages/api/hello.js
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req, res) {
  // Example of protected API route
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.status(200).json({ 
    name: "John Doe",
    email: session.user.email,
    message: "This is a protected API route"
  })
}