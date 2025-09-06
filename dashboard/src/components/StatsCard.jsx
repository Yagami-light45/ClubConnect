import React from 'react';

const StatsCard = ({ title, value, change, trend, icon }) => {
  // Add safety checks and default values
  const safeIcon = icon || {};
  const bgColor = safeIcon.bgColor || 'bg-blue-500';
  const iconPath = safeIcon.path || 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title || 'No Title'}</h3>
        <span className={`p-2 rounded-full ${bgColor}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={iconPath} 
            />
          </svg>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-800">{value || '0'}</span>
        {change && (
          <div className="flex items-center mt-2">
            
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard