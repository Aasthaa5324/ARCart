// MapComponent.jsx - Separate component to handle Leaflet map
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet CSS - Make sure this is in your _app.js or this component
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// LocationMarker component that handles map clicks
function LocationMarker({ position, onLocationSelect }) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      
      // Reverse geocoding to get address (optional)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          onLocationSelect(lat, lng, address);
        })
        .catch(() => {
          // Fallback to coordinates if geocoding fails
          onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

export default function MapComponent({ center, onLocationSelect, className }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
    
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      className={className}
      style={{ height: '256px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker position={center} onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}