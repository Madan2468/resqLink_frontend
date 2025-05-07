import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useCases } from '../context/CasesContext';
import CaseCard from '../components/cases/CaseCard';

const Home: React.FC = () => {
  const { cases, getCases, loading } = useCases();
  const [recentCases, setRecentCases] = useState<any[]>([]);

  useEffect(() => {
    getCases();
  }, []);

  useEffect(() => {
    if (cases.length > 0) {
      // Get the 3 most recent cases
      const sorted = [...cases].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 3);
      
      setRecentCases(sorted);
    }
  }, [cases]);

  const stats = [
    { id: 1, name: 'Animals Rescued', value: '5,000+', icon: <Heart className="h-8 w-8 text-red-500" /> },
    { id: 2, name: 'Active Volunteers', value: '750+', icon: <PawPrint className="h-8 w-8 text-green-500" /> },
    { id: 3, name: 'City Coverage', value: '100+', icon: <MapPin className="h-8 w-8 text-blue-500" /> },
    { id: 4, name: 'Response Time', value: '30 min', icon: <Clock className="h-8 w-8 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Help Animals in Need
              </h1>
              <p className="text-lg md:text-xl mb-8 animate-slide-up">
                Report, track, and assist with animal rescue operations in your area. Join our network of volunteers making a difference.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
                <Link
                  to="/register"
                  className="btn bg-white text-green-600 hover:bg-gray-100 hover:text-green-700 transform transition-transform hover:-translate-y-1"
                >
                  Join the Cause
                </Link>
                <Link
                  to="/report-case"
                  className="btn bg-green-600 text-white hover:bg-green-700 transform transition-transform hover:-translate-y-1"
                >
                  Report a Case
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <img 
                src="https://images.pexels.com/photos/1378849/pexels-photo-1378849.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" 
                alt="Animal rescue" 
                className="rounded-lg shadow-xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-300 animate-fade-in"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Together with our volunteers and communities, we've made a significant difference in the lives of animals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="font-bold text-3xl mb-2 text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Cases Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recent Cases</h2>
            <Link 
              to="/cases" 
              className="flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View all cases
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentCases.length > 0 ? (
                recentCases.map(caseItem => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No cases reported yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to report an animal in need!</p>
                  <Link
                    to="/report-case"
                    className="btn bg-green-500 text-white hover:bg-green-600 inline-block"
                  >
                    Report a Case
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to report and track animal rescue cases in your area.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Report a Case</h3>
              <p className="text-gray-600 text-center">
                Quickly report animals in need with details, photos, and location.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Responders are Notified</h3>
              <p className="text-gray-600 text-center">
                Local rescue teams and volunteers get alerts about new cases.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Track Progress</h3>
              <p className="text-gray-600 text-center">
                Follow the case from report to resolution with real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our community of animal lovers and help save lives today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="btn bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700"
            >
              Sign Up Now
            </Link>
            <Link
              to="/cases"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
            >
              View Active Cases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;