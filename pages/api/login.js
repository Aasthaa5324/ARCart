// pages/api/login.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Simple validation
    if (req.body.email && req.body.password) {
      return res.status(200).json({ token: 'dummy-token' })
    }
    return res.status(400).json({ error: 'Invalid credentials' })
  }
  return res.status(405).json({ error: 'Method not allowed' })
}