'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'
import { FiArrowLeft, FiLoader } from 'react-icons/fi'

// Dynamically import Three.js components to avoid SSR issues
const ModelViewer = dynamic(
  () => import('@/components/ModelViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-2xl text-blue-500" />
      </div>
    )
  }
)

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
      <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
      <p className="text-gray-600 max-w-md">{error.message}</p>
      <div className="flex gap-4">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiArrowLeft /> Back to Gallery
        </Link>
      </div>
    </div>
  )
}

export default function ModelViewerPage() {
  const router = useRouter()
  const [modelUrl, setModelUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (router.query.id) {
      setShareUrl(`${window.location.origin}/view?id=${router.query.id}`)
    }
  }, [router.query.id])

  useEffect(() => {
    const fetchModel = async () => {
      if (!router.query.id) return
      
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: supabaseError } = await supabase
          .from('furniture')
          .select('model_url')
          .eq('model_id', router.query.id)
          .single()

        if (supabaseError) throw supabaseError
        if (!data?.model_url) throw new Error('Model not found')

        setModelUrl(data.model_url)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [router.query.id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <FiLoader className="animate-spin text-3xl text-blue-500" />
        <p>Loading model...</p>
      </div>
    )
  }

  if (error) {
    return <ErrorFallback error={new Error(error)} resetErrorBoundary={() => window.location.reload()} />
  }

  return (
    <div className="relative h-screen w-full">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={
          <div className="flex justify-center items-center h-full">
            <FiLoader className="animate-spin text-2xl" />
          </div>
        }>
          {modelUrl && <ModelViewer modelUrl={modelUrl} />}
        </Suspense>

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md backdrop-blur-sm"
        >
          <FiArrowLeft /> Back to Gallery
        </Link>

        {/* QR Code Share */}
        {shareUrl && (
          <div className="absolute bottom-4 right-4 z-50 bg-white p-3 rounded-lg shadow-lg flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Scan to view on mobile</p>
            <div className="p-2 bg-white">
              {/* You'll need to install react-qr-code */}
              {/* <QRCode value={shareUrl} size={100} /> */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(shareUrl)}`} 
                alt="QR Code" 
                className="w-24 h-24"
              />
            </div>
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}