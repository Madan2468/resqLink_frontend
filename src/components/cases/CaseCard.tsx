import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

interface CaseCardProps {
  id: string;
  title?: string;
  photo: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  location?: {
    address?: string;
  };
}

const CaseCard: React.FC<CaseCardProps> = ({
  id,
  title,
  photo,
  urgency,
  status,
  createdAt,
  location
}) => {
  const getUrgencyBadge = () => {
    switch (urgency) {
      case 'high':
        return (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Urgent
          </div>
        );
      case 'medium':
        return (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Medium
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Low
          </div>
        );
    }
  };

  const getStatusBadge = () => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="rescue-card bg-white shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={photo}
          alt={title || "Animal rescue case"}
          className="w-full h-48 object-cover"
        />
        {getUrgencyBadge()}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {title || "Animal Rescue Case"}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2 text-sm">
          <Clock size={16} className="mr-1" />
          <span>{formatDate(createdAt)}</span>
        </div>
        
        {location?.address && (
          <div className="flex items-center text-gray-600 mb-3 text-sm">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{location.address}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div>{getStatusBadge()}</div>
          <Link
            to={`/cases/${id}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;