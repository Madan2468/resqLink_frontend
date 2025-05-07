import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';

// Fix the default marker icon issue in Leaflet with React
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on urgency
const urgencyIcons = {
  low: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  medium: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  high: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

interface MapCase {
  _id: string;
  title?: string;
  description?: string;
  photo: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface RescueMapProps {
  cases: MapCase[];
  centerPosition?: [number, number];
  zoom?: number;
  height?: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="status-badge status-pending">Pending</span>;
    case 'in-progress':
      return <span className="status-badge status-in-progress">In Progress</span>;
    case 'resolved':
      return <span className="status-badge status-resolved">Resolved</span>;
    default:
      return <span className="status-badge">{status}</span>;
  }
};

const RescueMap: React.FC<RescueMapProps> = ({ 
  cases, 
  centerPosition = [20.5937, 78.9629], // Center of India as default
  zoom = 5,
  height = '400px'
}) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div style={{ height }} className="flex justify-center items-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={zoom} 
      style={{ height, width: '100%' }} 
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {cases.map(caseItem => {
        if (!caseItem.location) return null;
        
        return (
          <Marker 
            key={caseItem._id} 
            position={[caseItem.location.lat, caseItem.location.lng]}
            icon={urgencyIcons[caseItem.urgency] || DefaultIcon}
          >
            <Popup>
              <div className="popup-content">
                <div className="text-center mb-2">
                  <img 
                    src={caseItem.photo} 
                    alt="Animal case" 
                    className="h-32 w-full object-cover rounded-md mb-2"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{caseItem.title || 'Animal Rescue Case'}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {caseItem.description?.substring(0, 100) || 'No description provided'}
                  {caseItem.description && caseItem.description.length > 100 ? '...' : ''}
                </p>
                
                <div className="flex justify-between items-center mb-2">
                  <div>Status: {getStatusLabel(caseItem.status)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <Link 
                  to={`/cases/${caseItem._id}`}
                  className="block text-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default RescueMap;