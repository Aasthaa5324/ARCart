'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'

export default function Home() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('furniture')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setModels(data || [])
      setLoading(false)
    }

    fetchModels()
  }, [])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) console.error('Login Error:', error)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Furniture AR Collection</h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <FcGoogle className="text-xl" />
          Login with Google
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(model => (
          <div key={model.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <img
                src={model.thumbnail_url}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{model.name}</h3>
              <Link
                href={`/view-ar?id=${model.model_id}`}
                className="mt-3 inline-block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                View in AR
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}