import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCases } from '../context/CasesContext';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, UserCircle, Edit2, LogOut, PlusCircle, RefreshCw } from 'lucide-react';
import CaseCard from '../components/cases/CaseCard';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { userCases, getUserCases, loading } = useCases();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    getUserCases();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement update user functionality
    setIsEditMode(false);
  };

  const handleRefresh = () => {
    getUserCases();
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 self-center"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-white rounded-full p-2 mr-4">
                  <UserCircle className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-green-100">{user.role === 'user' ? 'Volunteer' : 'Administrator'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex items-center bg-white text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  <Edit2 size={16} className="mr-1" />
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="flex items-center bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isEditMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-input-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                
                <div className="form-input-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                
                <div className="form-input-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                    <p className="text-lg font-medium">{user.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Reported Cases</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="flex items-center text-green-600 hover:text-green-700 transition-colors"
              >
                <RefreshCw size={16} className="mr-1" />
                Refresh
              </button>
              <Link
                to="/report-case"
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <PlusCircle size={16} className="mr-1" />
                Report New Case
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : userCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCases.map(caseItem => (
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
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No cases reported yet</h3>
              <p className="text-gray-500 mb-4">You haven't reported any animal rescue cases yet.</p>
              <Link
                to="/report-case"
                className="btn btn-primary inline-flex items-center"
              >
                <PlusCircle size={16} className="mr-2" />
                Report Your First Case
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;