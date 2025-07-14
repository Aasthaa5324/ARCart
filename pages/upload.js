'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import AuthRedirect from '@/components/AuthRedirect'

export default function UploadFurniture() {
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [modelFile, setModelFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!name || !thumbnail || !modelFile) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    setProgress(0)

    const id = uuidv4()
    const thumbnailExt = thumbnail.name.split('.').pop()
    const modelExt = modelFile.name.split('.').pop()

    try {
      // Upload thumbnail
      setProgress(10)
      const { error: thumbError } = await supabase.storage
        .from('thumbnails')
        .upload(`${id}.${thumbnailExt}`, thumbnail)

      if (thumbError) throw thumbError

      // Upload model
      setProgress(40)
      const { error: modelError } = await supabase.storage
        .from('models')
        .upload(`${id}.${modelExt}`, modelFile)

      if (modelError) throw modelError

      // Get public URLs
      setProgress(70)
      const thumbUrl = supabase.storage
        .from('thumbnails')
        .getPublicUrl(`${id}.${thumbnailExt}`).data.publicUrl

      const modelUrl = supabase.storage
        .from('models')
        .getPublicUrl(`${id}.${modelExt}`).data.publicUrl

      // Insert into DB
      setProgress(90)
      const { error: dbError } = await supabase.from('furniture').insert({
        name,
        model_id: id,
        model_url: modelUrl,
        thumbnail_url: thumbUrl
      })

      if (dbError) throw dbError

      setProgress(100)
      setSuccess('Furniture uploaded successfully!')
      setName('')
      setThumbnail(null)
      setModelFile(null)
    } catch (err) {
      setError(err.message)
      // Clean up uploaded files if error occurs
      if (progress > 0) {
        await supabase.storage.from('thumbnails').remove([`${id}.${thumbnailExt}`])
        await supabase.storage.from('models').remove([`${id}.${modelExt}`])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
          <h1 className="text-2xl font-bold mb-6">Upload Furniture</h1>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Furniture Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Modern Chair"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image (JPEG/PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3D Model (.GLB)
              </label>
              <input
                type="file"
                accept=".glb"
                onChange={(e) => setModelFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading || !name || !thumbnail || !modelFile}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Model'}
            </button>
          </div>
        </div>
      </div>
    </AuthRedirect>
  )
}