// 'use client'
// import { useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { v4 as uuidv4 } from 'uuid'
// import AuthRedirect from '@/components/AuthRedirect'

// export default function UploadFurniture() {
//   const [name, setName] = useState('')
//   const [thumbnail, setThumbnail] = useState(null)
//   const [modelFile, setModelFile] = useState(null)
//   const [progress, setProgress] = useState(0)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleUpload = async () => {
//     if (!name || !thumbnail || !modelFile) {
//       setError('Please fill all fields')
//       return
//     }

//     setLoading(true)
//     setError('')
//     setSuccess('')
//     setProgress(0)

//     const id = uuidv4()
//     const thumbnailExt = thumbnail.name.split('.').pop()
//     const modelExt = modelFile.name.split('.').pop()

//     try {
//       // Upload thumbnail
//       setProgress(10)
//       const { error: thumbError } = await supabase.storage
//         .from('thumbnails')
//         .upload(`${id}.${thumbnailExt}`, thumbnail)

//       if (thumbError) throw thumbError

//       // Upload model
//       setProgress(40)
//       const { error: modelError } = await supabase.storage
//         .from('models')
//         .upload(`${id}.${modelExt}`, modelFile)

//       if (modelError) throw modelError

//       // Get public URLs
//       setProgress(70)
//       const thumbUrl = supabase.storage
//         .from('thumbnails')
//         .getPublicUrl(`${id}.${thumbnailExt}`).data.publicUrl

//       const modelUrl = supabase.storage
//         .from('models')
//         .getPublicUrl(`${id}.${modelExt}`).data.publicUrl

//       // Insert into DB
//       setProgress(90)
//       const { error: dbError } = await supabase.from('furniture').insert({
//         name,
//         model_id: id,
//         model_url: modelUrl,
//         thumbnail_url: thumbUrl
//       })

//       if (dbError) throw dbError

//       setProgress(100)
//       setSuccess('Furniture uploaded successfully!')
//       setName('')
//       setThumbnail(null)
//       setModelFile(null)
//     } catch (err) {
//       setError(err.message)
//       // Clean up uploaded files if error occurs
//       if (progress > 0) {
//         await supabase.storage.from('thumbnails').remove([`${id}.${thumbnailExt}`])
//         await supabase.storage.from('models').remove([`${id}.${modelExt}`])
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <AuthRedirect>
//       <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
//           <h1 className="text-2xl font-bold mb-6">Upload Furniture</h1>
          
//           {error && (
//             <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
//               {success}
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Furniture Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Modern Chair"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Thumbnail Image (JPEG/PNG)
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setThumbnail(e.target.files[0])}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 3D Model (.GLB)
//               </label>
//               <input
//                 type="file"
//                 accept=".glb"
//                 onChange={(e) => setModelFile(e.target.files[0])}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>

//             {progress > 0 && (
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             )}

//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={loading || !name || !thumbnail || !modelFile}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Uploading...' : 'Upload Model'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </AuthRedirect>
//   )
// }

'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import AuthRedirect from '@/components/AuthRedirect'

export default function UploadFurniture() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [sellerAddress, setSellerAddress] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [modelFile, setModelFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const mapRef = useRef(null)
  const autocompleteRef = useRef(null)
  const addressInputRef = useRef(null)

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`
      script.onload = initializeMap
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!window.google) return

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.5355, lng: 77.3910 }, // Greater Noida coordinates
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      })

      // Initialize autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'IN' },
        }
      )

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry) {
          setSellerAddress(place.formatted_address)
          map.setCenter(place.geometry.location)
          map.setZoom(15)
          
          // Add marker
          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.formatted_address,
          })
        }
      })

      autocompleteRef.current = autocomplete
      setMapLoaded(true)
    }

    loadGoogleMaps()
  }, [])

  const handleUpload = async () => {
    if (!name || !price || !sellerName || !sellerAddress || !thumbnail || !modelFile) {
      setError('Please fill all fields')
      return
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError('Please enter a valid price')
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

      // Insert into DB with new fields
      setProgress(90)
      const { error: dbError } = await supabase.from('furniture').insert({
        name,
        model_id: id,
        model_url: modelUrl,
        thumbnail_url: thumbUrl,
        furniture_price: parseFloat(price),
        seller_name: sellerName,
        seller_address: sellerAddress
      })

      if (dbError) throw dbError

      setProgress(100)
      setSuccess('Furniture uploaded successfully!')
      
      // Reset form
      setName('')
      setPrice('')
      setSellerName('')
      setSellerAddress('')
      setThumbnail(null)
      setModelFile(null)
      if (addressInputRef.current) {
        addressInputRef.current.value = ''
      }
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <h1 className="text-3xl font-bold text-white">Upload Furniture</h1>
              <p className="text-green-100 mt-2">Add your furniture to the AR marketplace</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Furniture Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furniture Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., Modern Leather Chair"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="5000"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Seller Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Name *
                    </label>
                    <input
                      type="text"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Seller Address with Google Maps */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Address *
                    </label>
                    <input
                      ref={addressInputRef}
                      type="text"
                      onChange={(e) => setSellerAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Start typing your address..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use the search suggestions for accurate location
                    </p>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail Image (JPEG/PNG) *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3D Model (.GLB) *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept=".glb"
                          onChange={(e) => setModelFile(e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div 
                        ref={mapRef}
                        className="w-full h-64 bg-gray-100 flex items-center justify-center"
                      >
                        {!mapLoaded && (
                          <div className="text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
                            Loading map...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Upload Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading || !name || !price || !sellerName || !sellerAddress || !thumbnail || !modelFile}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Furniture
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  )
}