'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue in Next.js
const fixLeafletIcon = (L) => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Reverse geocoding helper
async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();
    
    // Format address more nicely
    if (data.address) {
      const parts = [];
      if (data.address.house_number) parts.push(data.address.house_number);
      if (data.address.road) parts.push(data.address.road);
      if (data.address.suburb) parts.push(data.address.suburb);
      if (data.address.city || data.address.town || data.address.village) {
        parts.push(data.address.city || data.address.town || data.address.village);
      }
      if (data.address.state) parts.push(data.address.state);
      if (data.address.postcode) parts.push(data.address.postcode);
      
      return parts.join(', ') || data.display_name;
    }
    
    return data.display_name || 'Address not found';
  } catch (error) {
    console.error('Geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

export default function ActualMapComponent({ 
  center = [28.5355, 77.3910], 
  onLocationSelect,
  className = "w-full h-64"
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    let isMounted = true;
    
    // Import Leaflet dynamically
    import('leaflet').then(async (L) => {
      if (!isMounted || !mapRef.current) return;

      // Fix icon issue
      fixLeafletIcon(L);

      // Initialize map
      const map = L.map(mapRef.current, {
        center: center,
        zoom: 13,
        scrollWheelZoom: true,
      });
      
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Function to update marker
      const updateMarker = (lat, lng, address) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          markerRef.current.setPopupContent(
            `<div class="font-medium">${address}</div>
             <div class="text-xs text-gray-500 mt-1">Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</div>`
          );
          markerRef.current.openPopup();
        } else {
          markerRef.current = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(
              `<div class="font-medium">${address}</div>
               <div class="text-xs text-gray-500 mt-1">Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</div>`
            )
            .openPopup();
        }
      };

      // Handle map click
      const handleMapClick = async (e) => {
        if (!isMounted) return;
        
        setIsLoading(true);
        const { lat, lng } = e.latlng;
        
        try {
          const address = await reverseGeocode(lat, lng);
          
          if (isMounted) {
            updateMarker(lat, lng, address);
            
            // Call the callback with location data
            if (onLocationSelect && typeof onLocationSelect === 'function') {
              onLocationSelect(lat, lng, address);
            }
          }
        } catch (error) {
          console.error('Error handling map click:', error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      // Add click event listener
      map.on('click', handleMapClick);

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (!isMounted) return;
            
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            
            setIsLoading(true);
            try {
              const address = await reverseGeocode(latitude, longitude);
              updateMarker(latitude, longitude, address);
              
              if (onLocationSelect && typeof onLocationSelect === 'function') {
                onLocationSelect(latitude, longitude, address);
              }
            } catch (error) {
              console.error('Error getting current location address:', error);
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            if (isMounted) {
              console.error('Geolocation error:', error);
              setGeoError('Unable to get your location');
              setTimeout(() => setGeoError(''), 3000);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }

      // Invalidate size to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mx-auto mb-1"></div>
            <p className="text-sm text-gray-600">Getting address...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {geoError && (
        <div className="absolute top-2 left-2 right-2 text-sm text-red-600 bg-white/90 p-2 rounded shadow-sm z-[1000]">
          {geoError}
        </div>
      )}
      
      {/* Instructions */}
            {/* Instructions */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm z-[999]">
        Click on map to select location
      </div>
    </div>
  );
}