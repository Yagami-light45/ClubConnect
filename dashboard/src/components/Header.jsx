  // src/components/Header.jsx (Updated)
  import React, { useState } from 'react';
  import { useAuth } from '../contexts/AuthContext';

  const Header = ({ showNotifications, setShowNotifications }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
      logout();
      setIsProfileOpen(false);
    };

    return (
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center">
            <div className="text-xl font-bold text-indigo-600">ClubConnect</div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification badge */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                2
              </span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center focus:outline-none p-2 rounded-full hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="ml-2 text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role?.toLowerCase().replace('_', ' ')}</p>
                </div>
                <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Preferences
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };

  export default Header;