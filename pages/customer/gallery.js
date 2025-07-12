'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiLoader, FiFilter, FiTrendingUp, FiClock } from 'react-icons/fi'

export default function Gallery() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('popular') // 'popular' or 'newest'

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('furniture')
          .select('id, name, model_id, thumbnail_url, view_count, created_at')
          
        if (sortBy === 'popular') {
          query = query.order('view_count', { ascending: false })
        } else {
          query = query.order('created_at', { ascending: false })
        }

        const { data, error } = await query.limit(12)

        if (error) throw error
        setModels(data || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching models:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [sortBy])

  const handleSortChange = (type) => {
    setSortBy(type)
  }

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[50vh]">
      <FiLoader className="animate-spin text-3xl text-blue-500 mb-4" />
      <p className="text-gray-600">Loading furniture collection...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-10 min-h-[50vh]">
      <p className="text-red-500 mb-4">Error loading models: {error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  )

  if (models.length === 0) return (
    <div className="text-center py-10 min-h-[50vh]">
      <p className="text-gray-600 mb-4">No furniture models available</p>
      <Link 
        href="/upload" 
        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload your first model
      </Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Furniture Collection</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => handleSortChange('popular')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${sortBy === 'popular' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'}`}
          >
            <FiTrendingUp className="text-blue-500" />
            <span>Popular</span>
          </button>
          <button 
            onClick={() => handleSortChange('newest')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${sortBy === 'newest' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'}`}
          >
            <FiClock className="text-blue-500" />
            <span>Newest</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {models.map(model => (
          <div 
            key={model.id} 
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={model.thumbnail_url || '/placeholder-furniture.jpg'}
                alt={model.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                priority={models.indexOf(model) < 4}
                onError={(e) => {
                  e.target.src = '/placeholder-furniture.jpg'
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1 text-gray-800">{model.name}</h3>
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-500 text-sm">
                  {model.view_count?.toLocaleString() || 0} views
                </p>
                {sortBy === 'newest' && (
                  <p className="text-gray-400 text-xs">
                    {new Date(model.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Link
                href={`/view-ar?id=${model.model_id}`}
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                onClick={() => {
                  // Track view count increment
                  supabase
                    .from('furniture')
                    .update({ view_count: (model.view_count || 0) + 1 })
                    .eq('id', model.id)
                    .then()
                }}
              >
                View in AR <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}