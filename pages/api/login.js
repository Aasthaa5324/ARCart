import { supabase } from '@/lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/dashboard'
      }
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    return res.status(200).json({ 
      message: 'Check your email for the login link!',
      user: data.user 
    })

  } catch (err) {
    console.error('OTP login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}