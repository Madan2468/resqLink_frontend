import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';

// Fix the default marker icon issue in React Leaflet
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelected: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

interface MarkerPositionProps {
  position: [number, number];
  setPosition: (position: [number, number]) => void;
  onLocationSelected: (location: { lat: number; lng: number; address?: string }) => void;
}

const MarkerPosition: React.FC<MarkerPositionProps> = ({ position, setPosition, onLocationSelected }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Get address using reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name;
          onLocationSelected({ lat, lng, address });
        })
        .catch(() => {
          onLocationSelected({ lat, lng });
        });
    },
  });

  return (
    <Marker position={position} />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelected, initialLocation }) => {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([20.5937, 78.9629]); // Default to center of India
  const [loading, setLoading] = useState<boolean>(true);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState<boolean>(false);

  useEffect(() => {
    // If initial location is provided, use it
    if (initialLocation) {
      setCurrentPosition([initialLocation.lat, initialLocation.lng]);
      setLoading(false);
      return;
    }
    
    // Otherwise, try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          
          // Get address using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name;
              onLocationSelected({ lat: latitude, lng: longitude, address });
            })
            .catch(() => {
              onLocationSelected({ lat: latitude, lng: longitude });
            });
            
          setUsingCurrentLocation(true);
          setLoading(false);
        },
        () => {
          // If error getting location, use default position
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [initialLocation]);

  const handlePositionChange = (position: [number, number]) => {
    setCurrentPosition(position);
    setUsingCurrentLocation(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          
          // Get address using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name;
              onLocationSelected({ lat: latitude, lng: longitude, address });
            })
            .catch(() => {
              onLocationSelected({ lat: latitude, lng: longitude });
            });
            
          setUsingCurrentLocation(true);
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert('Unable to retrieve your location. Please select manually or try again.');
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-2"></div>
        <p className="text-gray-600">Getting location...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-600">
          {usingCurrentLocation ? 'Using your current location' : 'Click on the map to set location'}
        </p>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center text-sm text-green-600 hover:text-green-700"
        >
          <MapPin size={14} className="mr-1" />
          Use my location
        </button>
      </div>
      
      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer 
          center={currentPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerPosition 
            position={currentPosition} 
            setPosition={handlePositionChange} 
            onLocationSelected={onLocationSelected} 
          />
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Note: The exact location will help rescuers find the animal quickly.
      </p>
    </div>
  );
};

export default LocationPicker;