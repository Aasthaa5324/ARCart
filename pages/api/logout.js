// pages/api/logout.js
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Logout error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}