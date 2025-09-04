import React from 'react';
import { mockApplications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { APPLICATION_STATUS } from '../../utils/constants';

const ApplicationStatus = () => {
  const { user } = useAuth();
  const userApplications = mockApplications.filter(app => app.studentId === user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <div className="text-sm text-gray-600">
          {userApplications.length} application{userApplications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {userApplications.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start by browsing available clubs and applying.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{application.clubName}</h3>
                    <p className="text-sm text-gray-600">
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    application.status === APPLICATION_STATUS.ACCEPTED
                      ? 'bg-green-100 text-green-800'
                      : application.status === APPLICATION_STATUS.REJECTED
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status === APPLICATION_STATUS.PENDING && 'Under Review'}
                    {application.status === APPLICATION_STATUS.ACCEPTED && 'Accepted'}
                    {application.status === APPLICATION_STATUS.REJECTED && 'Rejected'}
                  </span>
                </div>

                {/* Status Message */}
                <div className="mb-4">
                  {application.status === APPLICATION_STATUS.PENDING && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-yellow-800">
                          Your application is being reviewed by the club head. You'll be notified once a decision is made.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {application.status === APPLICATION_STATUS.ACCEPTED && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-800">
                          Congratulations! Your application has been accepted. You'll receive further instructions soon.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {application.status === APPLICATION_STATUS.REJECTED && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="flex">
                        <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-800">
                          Unfortunately, your application was not selected this time. Don't give up - try applying to other clubs!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Responses:</h4>
                  <div className="space-y-2">
                    {application.answers.map((answer, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-600">Q{index + 1}:</span>
                        <span className="text-gray-900 ml-2">{answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;