import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCases } from '../context/CasesContext';
import { useAuth } from '../context/AuthContext';
import RescueMap from '../components/map/RescueMap';
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Check, 
  AlertCircle, 
  ChevronLeft, 
  Phone, 
  Mail,
  Loader2 
} from 'lucide-react';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCaseById, updateCaseStatus, loading } = useCases();
  const { isAuthenticated, user } = useAuth();
  const [caseDetail, setCaseDetail] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        if (id) {
          const data = await getCaseById(id);
          setCaseDetail(data);
        }
      } catch (error) {
        console.error('Error fetching case details:', error);
      }
    };
    
    fetchCaseDetail();
  }, [ id]);
  
  const handleStatusUpdate = async (status: 'pending' | 'in-progress' | 'resolved') => {
    if (!id) return;
    
    try {
      setUpdatingStatus(true);
      await updateCaseStatus(id, status);
      
      // Update the local state
      setCaseDetail(prev => ({
        ...prev,
        status
      }));
      
      setStatusUpdateMessage({
        type: 'success',
        message: `Case status updated to ${status.replace('-', ' ')}`
      });
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setStatusUpdateMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error updating case status:', error);
      setStatusUpdateMessage({
        type: 'error',
        message: 'Failed to update status. Please try again.'
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
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
  
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <span className="status-badge status-urgent">Urgent</span>;
      case 'medium':
        return <span className="status-badge status-in-progress">Medium</span>;
      case 'low':
        return <span className="status-badge status-pending">Low</span>;
      default:
        return <span className="status-badge">{urgency}</span>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading || !caseDetail) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 self-center"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/cases" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all cases
          </Link>
        </div>
        
        {statusUpdateMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            statusUpdateMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex">
              {statusUpdateMessage.type === 'success' ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <p className={`text-sm ${
                statusUpdateMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>{statusUpdateMessage.message}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={caseDetail.photo} 
                alt={caseDetail.title || "Animal rescue case"} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {caseDetail.title || "Animal Rescue Case"}
                </h1>
                <div className="flex space-x-2">
                  {getStatusBadge(caseDetail.status)}
                  {getUrgencyBadge(caseDetail.urgency)}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Clock size={16} className="mr-2" />
                  <span>Reported on {formatDate(caseDetail.createdAt)}</span>
                </div>
                
                {caseDetail.location && caseDetail.location.address && (
                  <div className="flex items-start text-gray-600 text-sm">
                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{caseDetail.location.address}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">
                  {caseDetail.description || "No description provided for this case."}
                </p>
              </div>
              
              {isAuthenticated && user && user.role === 'admin' && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Update Status</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusUpdate('pending')}
                      disabled={caseDetail.status === 'pending' || updatingStatus}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        caseDetail.status === 'pending'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark as Pending'}
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate('in-progress')}
                      disabled={caseDetail.status === 'in-progress' || updatingStatus}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        caseDetail.status === 'in-progress'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark In Progress'}
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate('resolved')}
                      disabled={caseDetail.status === 'resolved' || updatingStatus}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        caseDetail.status === 'resolved'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark as Resolved'}
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Need help?</h2>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-800 mb-3">
                    Contact our emergency rescue team for immediate assistance:
                  </p>
                  <div className="flex items-center text-green-800 mb-2">
                    <Phone className="h-5 w-5 mr-2" />
                    <a href="tel:+1555-123-4567" className="hover:underline">+1 555-123-4567</a>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Mail className="h-5 w-5 mr-2" />
                    <a href="mailto:rescue@resqlink.org" className="hover:underline">rescue@resqlink.org</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {caseDetail.location && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Location</h2>
              <RescueMap 
                cases={[caseDetail]} 
                centerPosition={[caseDetail.location.lat, caseDetail.location.lng]} 
                zoom={15}
                height="400px"
              />
            </div>
          )}
          
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Similar Cases Nearby</h2>
            <p className="text-gray-600">
              We're checking for similar cases in this area that might be related.
            </p>
            {/* This would be populated with actual similar cases in a production environment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;