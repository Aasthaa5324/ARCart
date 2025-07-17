'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import AuthRedirect from '@/components/AuthRedirect';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

export default function UploadFurniture() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sellerName: '',
    sellerAddress: '',
    description: '', // Added description field
    category: 'chair' // Added category field
  });
  
  const [location, setLocation] = useState({
    lat: 28.5355,
    lng: 77.3910,
    address: ''
  });
  
  const [files, setFiles] = useState({
    thumbnail: null,
    modelFile: null
  });
  
  const [ui, setUi] = useState({
    progress: 0,
    error: '',
    success: '',
    loading: false,
    uploading: false
  });

  const categories = [
    { value: 'chair', label: 'Chair' },
    { value: 'table', label: 'Table' },
    { value: 'sofa', label: 'Sofa' },
    { value: 'bed', label: 'Bed' },
    { value: 'storage', label: 'Storage' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'decor', label: 'Decor' },
    { value: 'other', label: 'Other' }
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (ui.error) {
      setUi(prev => ({ ...prev, error: '' }));
    }
  };

  // Handle file changes with validation
  const handleFileChange = (type, file) => {
    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 100 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUi(prev => ({
        ...prev,
        error: `File too large. Maximum size is 10MB.`
      }));
      return;
    }

    // Validate file types
    if (type === 'thumbnail') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUi(prev => ({
          ...prev,
          error: 'Please select a valid image file (JPEG, PNG, or WebP).'
        }));
        return;
      }
    } else if (type === 'modelFile') {
      const allowedExtensions = ['.glb', '.gltf'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        setUi(prev => ({
          ...prev,
          error: 'Please select a valid 3D model file (.glb or .gltf).'
        }));
        return;
      }
    }

    setFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // Handle location selection from map
  const handleLocationSelect = (lat, lng, address) => {
    setLocation({ lat, lng, address });
    setFormData(prev => ({
      ...prev,
      sellerAddress: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }));
  };

  // Validate form data
  const validateForm = () => {
    const { name, price, sellerName } = formData;
    const { thumbnail, modelFile } = files;

    if (!name.trim()) return 'Please enter furniture name';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return 'Please enter a valid price';
    if (!sellerName.trim()) return 'Please enter seller name';
    if (!location.address) return 'Please select a location on the map';
    if (!thumbnail) return 'Please upload a thumbnail image';
    if (!modelFile) return 'Please upload a 3D model file';

    return null;
  };

  // Handle form submission
  const handleUpload = async () => {
    const validationError = validateForm();
    if (validationError) {
      setUi(prev => ({ ...prev, error: validationError }));
      return;
    }

    setUi(prev => ({ ...prev, loading: true, uploading: true, error: '', success: '', progress: 0 }));

    const id = uuidv4();
    const thumbnailExt = files.thumbnail.name.split('.').pop();
    const modelExt = files.modelFile.name.split('.').pop();

    try {
      // Upload thumbnail
      setUi(prev => ({ ...prev, progress: 20 }));
      const { error: thumbError } = await supabase.storage
        .from('thumbnail')
        .upload(`${id}.${thumbnailExt}`, files.thumbnail, {
          cacheControl: '3600',
          upsert: false
        });

      if (thumbError) throw new Error(`Thumbnail upload failed: ${thumbError.message}`);

      // Upload model
      setUi(prev => ({ ...prev, progress: 50 }));
      const { error: modelError } = await supabase.storage
        .from('models')
        .upload(`${id}.${modelExt}`, files.modelFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'model/gltf-binary'
        });

      if (modelError) throw new Error(`Model upload failed: ${modelError.message}`);

      // Get public URLs
      setUi(prev => ({ ...prev, progress: 70 }));
      const { data: thumbUrlData } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(`${id}.${thumbnailExt}`);

      const { data: modelUrlData } = supabase.storage
        .from('models')
        .getPublicUrl(`${id}.${modelExt}`);

      // Insert into database
      setUi(prev => ({ ...prev, progress: 90 }));
      const { error: dbError } = await supabase.from('furniture').insert({
        name: formData.name,
        model_id: id,
        model_url: modelUrlData.publicUrl,
        thumbnail_url: thumbUrlData.publicUrl,
        furniture_price: parseFloat(formData.price),
        seller_name: formData.sellerName,
        seller_address: formData.sellerAddress,
        description: formData.description,
        category: formData.category,
        location_lat: location.lat,
        location_lng: location.lng,
        created_at: new Date().toISOString()
      });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setUi(prev => ({ ...prev, progress: 100, success: 'Furniture uploaded successfully!' }));
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        sellerName: '',
        sellerAddress: '',
        description: '',
        category: 'chair'
      });
      setFiles({ thumbnail: null, modelFile: null });
      setLocation({ lat: 28.5355, lng: 77.3910, address: '' });

    } catch (err) {
      console.error('Upload error:', err);
      setUi(prev => ({ ...prev, error: err.message }));
      
      // Cleanup uploaded files on error
      if (ui.progress > 20) {
        await supabase.storage.from('thumbnail').remove([`${id}.${thumbnailExt}`]);
      }
      if (ui.progress > 50) {
        await supabase.storage.from('models').remove([`${id}.${modelExt}`]);
      }
    } finally {
      setUi(prev => ({ ...prev, loading: false, uploading: false }));
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <h1 className="text-3xl font-bold text-white">Upload Furniture</h1>
              <p className="text-green-100 mt-2">Add your furniture to the AR marketplace</p>
            </div>

            <div className="p-6">
              {/* Alert Messages */}
              {ui.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {ui.error}
                </div>
              )}

              {ui.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {ui.success}
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
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., Modern Leather Chair"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
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
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="5000"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Describe your furniture item..."
                    />
                  </div>

                  {/* Seller Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Name *
                    </label>
                    <input
                      type="text"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange('sellerName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Address Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Location *
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                      {location.address || 'Click on the map to select location'}
                    </div>
                  </div>
                </div>

                {/* Right Column - Map and Files */}
                <div className="space-y-6">
                  {/* Map */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Location on Map *
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <DynamicMap
                        center={[location.lat, location.lng]}
                        onLocationSelect={handleLocationSelect}
                        className="w-full h-64"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Click on the map to set your location
                    </p>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail Image *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleFileChange('thumbnail', e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          JPEG, PNG, or WebP. Maximum 10MB.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3D Model File *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept=".glb,.gltf"
                          onChange={(e) => handleFileChange('modelFile', e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          GLB or GLTF format. Maximum 10MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {ui.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Upload Progress</span>
                        <span>{ui.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${ui.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={ui.loading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {ui.loading ? (
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
  );
}
