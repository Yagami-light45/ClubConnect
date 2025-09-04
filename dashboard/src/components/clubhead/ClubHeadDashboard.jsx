import React from 'react';
import { mockClubs, mockApplications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { APPLICATION_STATUS } from '../../utils/constants';

const ClubHeadDashboard = () => {
  const { user } = useAuth();
  const userClub = mockClubs.find(club => club.headId === user.id);
  const clubApplications = mockApplications.filter(app => app.clubId === userClub?.id);
  
  const pendingApplications = clubApplications.filter(app => app.status === APPLICATION_STATUS.PENDING);
  const acceptedApplications = clubApplications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED);

  if (!userClub) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Club Assigned</h2>
        <p className="text-gray-600">Please contact the admin to assign you to a club.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{userClub.name} Dashboard</h1>
        <div className="flex space-x-3">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Edit Club Info
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Start Recruitment
          </button>
        </div>
      </div>

      {/* Club Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Club Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">{userClub.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p className="text-gray-900">{userClub.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recruitment Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              userClub.isRecruiting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userClub.isRecruiting ? 'Active' : 'Closed'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Deadline</p>
            <p className="text-gray-900">
              {userClub.recruitmentDeadline 
                ? new Date(userClub.recruitmentDeadline).toLocaleDateString()
                : 'Not set'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{clubApplications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{acceptedApplications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      {pendingApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingApplications.slice(0, 3).map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{application.studentName}</h3>
                      <p className="text-gray-600">{application.studentBranch} - Year {application.studentYear}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Accept
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        Reject
                      </button>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubHeadDashboard;