import React, { useState } from 'react';
import { mockApplications, mockClubs } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { APPLICATION_STATUS } from '../../utils/constants';

const ApplicantsList = () => {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  
  const userClub = mockClubs.find(club => club.headId === user.id);
  const clubApplications = mockApplications.filter(app => app.clubId === userClub?.id);
  
  const filteredApplications = clubApplications.filter(app => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (filterBranch !== 'all' && app.studentBranch !== filterBranch) return false;
    return true;
  });

  const branches = [...new Set(clubApplications.map(app => app.studentBranch))];

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
        <h1 className="text-2xl font-bold text-gray-900">Applicants - {userClub.name}</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value={APPLICATION_STATUS.PENDING}>Pending</option>
            <option value={APPLICATION_STATUS.ACCEPTED}>Accepted</option>
            <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch & Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                    <div className="text-sm text-gray-500">{application.studentEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.studentBranch} - Year {application.studentYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    application.status === APPLICATION_STATUS.ACCEPTED
                      ? 'bg-green-100 text-green-800'
                      : application.status === APPLICATION_STATUS.REJECTED
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                  {application.status === APPLICATION_STATUS.PENDING && (
                    <>
                      <button className="text-green-600 hover:text-green-900">
                        Accept
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Application Details - {selectedApplication.studentName}
              </h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Student Information</h4>
                <p className="text-sm text-gray-600">Email: {selectedApplication.studentEmail}</p>
                <p className="text-sm text-gray-600">Branch: {selectedApplication.studentBranch}</p>
                <p className="text-sm text-gray-600">Year: {selectedApplication.studentYear}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Responses to Custom Questions</h4>
                <div className="space-y-3 mt-2">
                  {userClub.customQuestions.map((question, index) => (
                    <div key={index} className="border-l-4 border-indigo-200 pl-4">
                      <p className="text-sm font-medium text-gray-700">{question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedApplication.answers[index] || 'No answer provided'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {selectedApplication.status === APPLICATION_STATUS.PENDING && (
                <>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                    Accept
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;