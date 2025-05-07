import React, { useEffect, useState } from 'react';
import { useCases } from '../context/CasesContext';
import RescueMap from '../components/map/RescueMap';
import CaseCard from '../components/cases/CaseCard';
import { Search, Filter, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';

const ViewCases: React.FC = () => {
  const { cases, getCases, loading } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  useEffect(() => {
    getCases();
  }, [getCases]);
  
  const handleRefresh = () => {
    getCases();
  };
  
  const getFilteredCases = () => {
    return cases.filter(caseItem => {
      // Filter by search term
      const matchesSearch = 
        !searchTerm || 
        (caseItem.title && caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (caseItem.description && caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by urgency
      const matchesUrgency = selectedUrgency === 'all' || caseItem.urgency === selectedUrgency;
      
      // Filter by status
      const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
      
      return matchesSearch && matchesUrgency && matchesStatus;
    });
  };
  
  const filteredCases = getFilteredCases();
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Animal Rescue Cases</h1>
            <p className="text-gray-600 mt-1">View and track animal rescue cases near you</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin size={16} className="mr-1" />
              Map View
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={16} className="mr-1" />
              List View
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search by title or description"
              />
            </div>
            
            <div className="flex space-x-4">
              <div>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="all">All Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredCases.length > 0 ? (
          <>
            {viewMode === 'map' ? (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <RescueMap cases={filteredCases} height="600px" zoom={6} />
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">{filteredCases.length}</span> cases shown on map. Click on markers for details.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map(caseItem => (
                  <CaseCard
                    key={caseItem._id}
                    id={caseItem._id}
                    title={caseItem.title}
                    photo={caseItem.photo}
                    urgency={caseItem.urgency}
                    status={caseItem.status}
                    createdAt={caseItem.createdAt}
                    location={caseItem.location}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedUrgency !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'There are no animal rescue cases reported in this area yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCases;