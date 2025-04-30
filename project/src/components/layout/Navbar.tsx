import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';
import HelpCenter from '../help/HelpCenter';
import Calendar from '../calendar/Calendar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden">
            <Menu size={20} />
          </button>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none relative"
          >
            Calendar
          </button>
          
          <NotificationCenter />
          <HelpCenter />
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={user?.profilePicture || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:inline-block font-medium">{user?.name}</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full mx-4 relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Calendar />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;