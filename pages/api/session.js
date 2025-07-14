// pages/api/session.js
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return res.status(401).json({ authenticated: false })
    }

    return res.status(200).json({
      authenticated: true,
      user: session.user
    })

  } catch (err) {
    console.error('Session check error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}