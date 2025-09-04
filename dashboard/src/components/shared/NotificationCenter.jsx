import React from 'react';
import { mockNotifications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const NotificationCenter = ({ onClose }) => {
  const { user } = useAuth();
  
  const userNotifications = mockNotifications.filter(n => n.userId === user.id);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            userNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h4 className="font-medium text-gray-900 text-sm">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {notification.message}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
        
        {userNotifications.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button className="text-sm text-indigo-600 hover:text-indigo-500">
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;