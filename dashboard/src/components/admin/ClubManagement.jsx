// src/components/ClubManagement.jsx
import React, { useState } from 'react';
import { mockClubs, CLUB_STATUS } from '../data/mockData';

const ClubManagement = () => {
  const [clubs, setClubs] = useState(mockClubs);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApproveClub = (clubId) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, status: CLUB_STATUS.APPROVED } : club
    ));
  };

  const handleRejectClub = (clubId) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, status: CLUB_STATUS.REJECTED } : club
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CLUB_STATUS.APPROVED:
        return 'bg-green-100 text-green-800';
      case CLUB_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CLUB_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Club Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add New Club
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
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
            {clubs.map((club) => (
              <tr key={club.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={club.image} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{club.name}</div>
                      <div className="text-sm text-gray-500">{club.headName || 'No Head Assigned'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {club.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {club.currentMembers}/{club.maxMembers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(club.status)}`}>
                    {club.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClub(club);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  {club.status === CLUB_STATUS.PENDING && (
                    <>
                      <button
                        onClick={() => handleApproveClub(club.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClub(club.id)}
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
      </div>

      {/* Modal */}
      {showModal && selectedClub && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedClub.name}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Description:</strong> {selectedClub.description}</p>
                <p><strong>Category:</strong> {selectedClub.category}</p>
                <p><strong>Requirements:</strong> {selectedClub.requirements}</p>
                <p><strong>Max Members:</strong> {selectedClub.maxMembers}</p>
                <p><strong>Current Members:</strong> {selectedClub.currentMembers}</p>
                <p><strong>Created:</strong> {new Date(selectedClub.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;