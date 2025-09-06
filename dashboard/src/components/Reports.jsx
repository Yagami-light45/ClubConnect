// src/components/Reports.jsx
import React, { useState } from 'react';
import { mockApplications, mockClubs, APPLICATION_STATUS } from '../data/mockData';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');

  const getApplicationStats = () => {
    const stats = mockApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const getClubMembershipData = () => {
    return mockClubs.map(club => ({
      name: club.name,
      members: club.currentMembers,
      capacity: club.maxMembers,
      utilization: Math.round((club.currentMembers / club.maxMembers) * 100)
    }));
  };

  const applicationStats = getApplicationStats();
  const clubData = getClubMembershipData();

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'applications', name: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'clubs', name: 'Clubs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
      
      {/* Report Type Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-4 mb-6">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                selectedReport === type.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
              </svg>
              {type.name}
            </button>
          ))}
        </div>

        {selectedReport === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockClubs.length}</div>
                <div className="text-sm text-blue-600">Total Clubs</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockApplications.length}</div>
                <div className="text-sm text-green-600">Total Applications</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {mockClubs.reduce((sum, club) => sum + club.currentMembers, 0)}
                </div>
                <div className="text-sm text-purple-600">Total Members</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {applicationStats[APPLICATION_STATUS.PENDING] || 0}
                </div>
                <div className="text-sm text-yellow-600">Pending Reviews</div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'applications' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Application Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(applicationStats).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-600">{status.replace('_', ' ')}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Applications</h3>
                <div className="space-y-3">
                  {mockApplications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="text-sm font-medium">{app.studentName}</div>
                        <div className="text-xs text-gray-500">{app.clubName}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        app.status === APPLICATION_STATUS.ACCEPTED ? 'bg-green-100 text-green-800' :
                        app.status === APPLICATION_STATUS.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'clubs' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Club Membership Overview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clubData.map((club, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{club.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{club.members}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{club.capacity}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${club.utilization}%` }}
                              ></div>
                            </div>
                            <span>{club.utilization}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;