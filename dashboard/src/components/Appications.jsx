// src/components/Applications.jsx
import React, { useState } from 'react';
import { mockApplications, APPLICATION_STATUS } from '../data/mockData';

const Applications = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const updateApplicationStatus = (appId, status) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status } : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case APPLICATION_STATUS.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case APPLICATION_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      case APPLICATION_STATUS.UNDER_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case APPLICATION_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: APPLICATION_STATUS.PENDING, label: 'Pending' },
    { value: APPLICATION_STATUS.UNDER_REVIEW, label: 'Under Review' },
    { value: APPLICATION_STATUS.ACCEPTED, label: 'Accepted' },
    { value: APPLICATION_STATUS.REJECTED, label: 'Rejected' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length}
          </div>
          <div className="text-sm text-yellow-600">Pending Review</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length}
          </div>
          <div className="text-sm text-blue-600">Under Review</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length}
          </div>
          <div className="text-sm text-green-600">Accepted</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length}
          </div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied
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
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {application.studentName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                      <div className="text-sm text-gray-500">{application.studentEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.clubName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  {application.status === APPLICATION_STATUS.PENDING && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(application.id, APPLICATION_STATUS.UNDER_REVIEW)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, APPLICATION_STATUS.ACCEPTED)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, APPLICATION_STATUS.REJECTED)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {application.status === APPLICATION_STATUS.UNDER_REVIEW && (
                    <>
                      <button
                        onClick={() => updateApplicationStatus(application.id, APPLICATION_STATUS.ACCEPTED)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, APPLICATION_STATUS.REJECTED)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No applications found for the selected filter.</div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicant</label>
                    <p className="text-sm text-gray-900">{selectedApplication.studentName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedApplication.studentEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Club</label>
                    <p className="text-sm text-gray-900">{selectedApplication.clubName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applied On</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Responses</label>
                  <div className="space-y-3">
                    {Object.entries(selectedApplication.responses).map(([question, answer]) => (
                      <div key={question} className="border rounded-md p-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">{question}</div>
                        <div className="text-sm text-gray-900">{answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedApplication.status === APPLICATION_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, APPLICATION_STATUS.ACCEPTED);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, APPLICATION_STATUS.REJECTED);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;