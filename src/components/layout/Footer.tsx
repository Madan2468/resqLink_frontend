import { PawPrint, Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <PawPrint className="h-8 w-8 text-green-400 mr-2" />
              <span className="text-xl font-bold text-white">ResQLink</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Connecting people with animals in need. Our mission is to create a world where every animal is safe, cared for, and loved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/cases" className="text-gray-300 hover:text-green-400 transition-colors">Rescue Map</Link>
              </li>
              <li>
                <Link to="/report-case" className="text-gray-300 hover:text-green-400 transition-colors">Report a Case</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-green-400 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-green-400 transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Emergency Animal Care</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Wildlife Rescue Tips</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Volunteer Opportunities</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Educational Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Partner Organizations</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">123 Rescue Way, Animal City, AC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300">help@resqlink.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ResQLink. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
          <div className="text-center mt-4 text-gray-400 text-sm flex items-center justify-center">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 mx-1 animate-pulse-slow" />
            <span>for animals everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;