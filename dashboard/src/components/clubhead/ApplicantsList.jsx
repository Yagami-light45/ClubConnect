import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ApplicantsList = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [clubData, setClubData] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token || ''}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Fetch club data
  const fetchClubData = useCallback(async () => {
    if (!currentUser?.clubId) return;

    try {
      const data = await apiCall(`/clubs/${currentUser.clubId}`);
      setClubData(data);
    } catch (error) {
      console.error('Error fetching club data:', error);
    }
  }, [currentUser?.clubId]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    if (!currentUser?.clubId) return;

    try {
      setError(null);
      const data = await apiCall(`/applications/club/${currentUser.clubId}`);
      setApplications(data.applications || data || []);
    } catch (error) {
      setError('Failed to load applications');
      setApplications([]);
    }
  }, [currentUser?.clubId]);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      if (!currentUser?.clubId) {
        setLoading(false);
        return;
      }

      try {
        await Promise.all([
          fetchClubData(),
          fetchApplications()
        ]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [currentUser?.clubId, fetchClubData, fetchApplications]);

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdating(true);

    try {
      await apiCall(`/applications/${applicationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      // Update local state
      setApplications(applications.map(app => 
        (app._id || app.id) === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));

      setSelectedApplication(null);
      alert('Application status updated successfully!');
    } catch (error) {
      alert('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (filterBranch !== 'all' && app.studentBranch !== filterBranch) return false;
    return true;
  });

  // Get unique branches for filter
  const branches = [...new Set(applications.map(app => app.studentBranch).filter(Boolean))];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading applications...</span>
      </div>
    );
  }

  // No club assigned
  if (!currentUser?.clubId || !clubData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Club Assigned</h2>
        <p className="text-gray-600">Please contact the admin to assign you to a club.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => {
            setError(null);
            fetchApplications();
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants - {clubData.name}</h1>
          <p className="text-gray-600">Total Applications: {applications.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {branches.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterBranch('all');
            }}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            {applications.length === 0 ? (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">No applications received yet</p>
                <p className="text-sm mt-2">Applications will appear here once students start applying to your club.</p>
              </>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <p className="text-lg">No applications match your filters</p>
                <p className="text-sm mt-2">Try adjusting your filters to see more applications.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
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
                  <tr key={application._id || application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.studentName || 'Unknown Student'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.studentEmail || 'No email provided'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.studentBranch ? `${application.studentBranch} - Year ${application.studentYear || 'N/A'}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : application.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ') : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateApplicationStatus(application._id || application.id, 'under_review')}
                            disabled={updating}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            Review
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(application._id || application.id, 'accepted')}
                            disabled={updating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(application._id || application.id, 'rejected')}
                            disabled={updating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {application.status === 'under_review' && (
                        <>
                          <button 
                            onClick={() => updateApplicationStatus(application._id || application.id, 'accepted')}
                            disabled={updating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(application._id || application.id, 'rejected')}
                            disabled={updating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Application Details - {selectedApplication.studentName || 'Unknown Student'}
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
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="text-gray-900">{selectedApplication.studentName || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedApplication.studentEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Branch:</span>
                    <p className="text-gray-900">{selectedApplication.studentBranch || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Year:</span>
                    <p className="text-gray-900">{selectedApplication.studentYear || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Applied Date:</span>
                    <p className="text-gray-900">
                      {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="text-gray-900 capitalize">
                      {selectedApplication.status ? selectedApplication.status.replace('_', ' ') : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedApplication.responses && Object.keys(selectedApplication.responses).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900">Responses to Questions</h4>
                  <div className="space-y-3 mt-2">
                    {Object.entries(selectedApplication.responses).map(([question, answer], index) => (
                      <div key={index} className="border-l-4 border-indigo-200 pl-4">
                        <p className="text-sm font-medium text-gray-700">{question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {answer || 'No answer provided'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {selectedApplication.status === 'pending' && (
                <>
                  <button 
                    onClick={() => updateApplicationStatus(selectedApplication._id || selectedApplication.id, 'under_review')}
                    disabled={updating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Mark as Under Review'}
                  </button>
                  <button 
                    onClick={() => updateApplicationStatus(selectedApplication._id || selectedApplication.id, 'accepted')}
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Accept'}
                  </button>
                  <button 
                    onClick={() => updateApplicationStatus(selectedApplication._id || selectedApplication.id, 'rejected')}
                    disabled={updating}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Reject'}
                  </button>
                </>
              )}
              {selectedApplication.status === 'under_review' && (
                <>
                  <button 
                    onClick={() => updateApplicationStatus(selectedApplication._id || selectedApplication.id, 'accepted')}
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Accept'}
                  </button>
                  <button 
                    onClick={() => updateApplicationStatus(selectedApplication._id || selectedApplication.id, 'rejected')}
                    disabled={updating}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Reject'}
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