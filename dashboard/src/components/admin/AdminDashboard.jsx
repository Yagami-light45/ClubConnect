// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../StatsCard';
import { mockStats, mockClubs, mockApplications, CLUB_STATUS, APPLICATION_STATUS } from '../../data/mockData';

const AdminDashboard = ({ currentView, setCurrentView }) => {
  const [clubs, setClubs] = useState(mockClubs);
  const [applications] = useState(mockApplications);
  const [selectedClub, setSelectedClub] = useState(null);

  // Calculate real-time stats
  const stats = [
    {
      ...mockStats[0],
      value: clubs.length.toString()
    },
    {
      ...mockStats[1], 
      value: applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length.toString()
    },
    {
      ...mockStats[2],
      value: clubs.reduce((sum, club) => sum + club.currentMembers, 0).toString()
    },
    {
      ...mockStats[3],
      value: clubs.filter(club => club.status === CLUB_STATUS.PENDING).length.toString()
    }
  ];

  const approveClub = (clubId) => {
    setClubs(clubs.map(club => 
      club.id === clubId 
        ? { ...club, status: CLUB_STATUS.APPROVED, isRecruiting: true }
        : club
    ));
  };

  const rejectClub = (clubId) => {
    setClubs(clubs.map(club => 
      club.id === clubId 
        ? { ...club, status: CLUB_STATUS.REJECTED }
        : club
    ));
  };

  const assignHead = (clubId, headName) => {
    if (!headName.trim()) return;
    
    setClubs(clubs.map(club => 
      club.id === clubId 
        ? { ...club, headName: headName, headId: Date.now() } // Mock head ID
        : club
    ));
    setSelectedClub(null);
  };

  if (currentView === 'club-management') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Club Management</h1>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">{club.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  club.status === CLUB_STATUS.APPROVED 
                    ? 'bg-green-100 text-green-800'
                    : club.status === CLUB_STATUS.PENDING
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {club.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{club.description}</p>
              <p className="text-xs text-gray-500 mb-3">Category: {club.category}</p>
              
              <div className="mb-3">
                <p className="text-sm">
                  <span className="font-medium">Head:</span> 
                  {club.headName ? (
                    <span className="text-green-600 ml-1">{club.headName}</span>
                  ) : (
                    <span className="text-red-600 ml-1">Not Assigned</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Members:</span> {club.currentMembers}/{club.maxMembers}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {club.status === CLUB_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => approveClub(club.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectClub(club.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {!club.headName && (
                  <button
                    onClick={() => setSelectedClub(club.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Assign Head
                  </button>
                )}
              </div>
              
              {selectedClub === club.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <input
                    type="text"
                    placeholder="Enter head name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        assignHead(club.id, e.target.value);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        const input = e.target.parentElement.previousElementSibling;
                        assignHead(club.id, input.value);
                      }}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => setSelectedClub(null)}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
        <button
          onClick={() => setCurrentView('club-management')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Manage All Clubs
        </button>
      </div>

      {/* Pending Club Approvals */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Pending Club Approvals</h2>
        <div className="space-y-4">
          {clubs.filter(club => club.status === CLUB_STATUS.PENDING).length > 0 ? (
            clubs.filter(club => club.status === CLUB_STATUS.PENDING).map(club => (
              <div key={club.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <p className="font-semibold">{club.name}</p>
                  <p className="text-sm text-gray-600">{club.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveClub(club.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectClub(club.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pending club approvals.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;