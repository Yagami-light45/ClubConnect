// src/components/Recruitment.jsx
import React, { useState } from 'react';
import { mockRecruitmentDrives } from '../data/mockData';

const Recruitment = () => {
  const [drives, setDrives] = useState(mockRecruitmentDrives);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    maxApplications: 20,
    questions: []
  });

  const handleCreateDrive = async (e) => {
     e.preventDefault();
    setIsSubmitting(true);
    const drive = {
      id: Date.now(),
      clubId: 1, // Assuming current club
      ...newDrive,
      currentApplications: 0,
      isActive: true
    };
    console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('API baseURL:', api.defaults.baseURL);
    setDrives([...drives, drive]);
    setShowCreateModal(false);
    setNewDrive({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      maxApplications: 20,
      questions: []
    });
  };

  const toggleDriveStatus = (driveId) => {
    setDrives(drives.map(drive => 
      drive.id === driveId ? { ...drive, isActive: !drive.isActive } : drive
    ));
  };

  const addQuestion = () => {
    setNewDrive({
      ...newDrive,
      questions: [
        ...newDrive.questions,
        { id: Date.now(), question: '', type: 'text', required: true }
      ]
    });
  };

  const updateQuestion = (questionId, field, value) => {
    setNewDrive({
      ...newDrive,
      questions: newDrive.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  const removeQuestion = (questionId) => {
    setNewDrive({
      ...newDrive,
      questions: newDrive.questions.filter(q => q.id !== questionId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Recruitment Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Create New Drive
        </button>
      </div>

      <div className="grid gap-6">
        {drives.map((drive) => (
          <div key={drive.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{drive.title}</h3>
                  <p className="text-gray-600 mt-1">{drive.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  drive.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {drive.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-sm text-gray-900">{new Date(drive.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-sm text-gray-900">{new Date(drive.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applications</label>
                  <p className="text-sm text-gray-900">{drive.currentApplications}/{drive.maxApplications}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Questions</label>
                  <p className="text-sm text-gray-900">{drive.questions?.length || 0}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(drive.currentApplications / drive.maxApplications) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {drive.currentApplications} applications received
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleDriveStatus(drive.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      drive.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {drive.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200">
                    View Applications
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Drive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Recruitment Drive</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newDrive.title}
                    onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Spring 2024 Recruitment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newDrive.description}
                    onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the recruitment drive..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newDrive.startDate}
                      onChange={(e) => setNewDrive({ ...newDrive, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={newDrive.endDate}
                      onChange={(e) => setNewDrive({ ...newDrive, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Applications</label>
                  <input
                    type="number"
                    value={newDrive.maxApplications}
                    onChange={(e) => setNewDrive({ ...newDrive, maxApplications: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                  />
                </div>

                {/* Questions Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Application Questions</label>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      + Add Question
                    </button>
                  </div>
                  
                  {newDrive.questions.map((question) => (
                    <div key={question.id} className="border rounded-md p-3 mb-2">
                      <div className="flex justify-between items-start mb-2">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question..."
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                        </select>
                        <label className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                            className="mr-1"
                          />
                          Required
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDrive}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Create Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;