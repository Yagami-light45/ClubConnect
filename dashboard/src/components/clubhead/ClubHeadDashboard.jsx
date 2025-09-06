// src/components/clubhead/ClubHeadDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClubs, mockApplications, mockRecruitmentDrives, APPLICATION_STATUS } from '../../data/mockData';
import StatsCard from '../StatsCard';

const ClubHeadDashboard = ({ currentView, setCurrentView }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState(mockApplications);
  const [recruitmentDrives, setRecruitmentDrives] = useState(mockRecruitmentDrives);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Profile management state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    bio: '',
    experience: '',
    specializations: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Initialize profile form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || '',
        position: currentUser.position || 'Club Head',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        experience: currentUser.experience || '',
        specializations: currentUser.specializations || ''
      });
    }
  }, [currentUser]);
  
  // Get current user's club
  const userClub = mockClubs.find(club => club.headId === currentUser.id);
  const clubApplications = applications.filter(app => app.clubId === userClub?.id);
  const clubDrives = recruitmentDrives.filter(drive => drive.clubId === userClub?.id);

  // Profile form handlers
  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the current user context (in a real app, this would be handled by the AuthContext)
      alert('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const cancelProfileEdit = () => {
    // Reset form to original values
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      department: currentUser.department || '',
      position: currentUser.position || 'Club Head',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      experience: currentUser.experience || '',
      specializations: currentUser.specializations || ''
    });
    setIsEditingProfile(false);
  };

  // Calculate stats for this club
  const stats = [
    {
      title: 'Total Applications',
      value: clubApplications.length.toString(),
      change: '+5',
      trend: 'up',
      icon: { 
        path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-blue-500'
      }
    },
    {
      title: 'Pending Review',
      value: clubApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length.toString(),
      change: '0',
      trend: 'up',
      icon: { 
        path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-yellow-500'
      }
    },
    {
      title: 'Accepted',
      value: clubApplications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length.toString(),
      change: '+3',
      trend: 'up',
      icon: { 
        path: 'M5 13l4 4L19 7',
        bgColor: 'bg-green-500'
      }
    },
    {
      title: 'Current Members',
      value: userClub?.currentMembers?.toString() || '0',
      change: '+8',
      trend: 'up',
      icon: { 
        path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
        bgColor: 'bg-purple-500'
      }
    }
  ];

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === appId 
        ? { ...app, status: newStatus }
        : app
    ));
    setSelectedApp(null);
  };

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Club Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {isEditingProfile ? (
              // Edit Profile Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department/Faculty
                    </label>
                    <select
                      value={profileForm.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Student Affairs">Student Affairs</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Role
                    </label>
                    <select
                      value={profileForm.position}
                      onChange={(e) => handleProfileChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Club Head">Club Head</option>
                      <option value="Faculty Advisor">Faculty Advisor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Student Coordinator">Student Coordinator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/About Me
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us about yourself and your role as club head..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience & Background
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.experience}
                    onChange={(e) => handleProfileChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your relevant experience, achievements, and background..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise/Specializations (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.specializations}
                    onChange={(e) => handleProfileChange('specializations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Leadership, Project Management, Technical Writing, Event Planning"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={cancelProfileEdit}
                    disabled={profileSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              // View Profile
              <div className="space-y-6">
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                  <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-indigo-600">
                      {(currentUser.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {currentUser.name || 'Unknown User'}
                    </h2>
                    <p className="text-gray-600">
                      {currentUser.position || 'Club Head'} • {currentUser.department || 'Department not specified'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Managing: {userClub?.name || 'No club assigned'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email Address</span>
                        <p className="text-gray-800">{currentUser.email || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <p className="text-gray-800">{currentUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Professional Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Department/Faculty</span>
                        <p className="text-gray-800">{currentUser.department || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Position/Role</span>
                        <p className="text-gray-800">{currentUser.position || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {userClub && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Club Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Club Name:</span>
                        <p className="font-medium text-gray-800">{userClub.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium text-gray-800">{userClub.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Members:</span>
                        <p className="font-medium text-gray-800">{userClub.currentMembers}/{userClub.maxMembers}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Description:</span>
                      <p className="text-gray-800 text-sm mt-1">{userClub.description}</p>
                    </div>
                  </div>
                )}
                
                {(currentUser.bio || currentUser.experience || currentUser.specializations) && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    {currentUser.bio && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">About Me</h3>
                        <p className="text-gray-600 leading-relaxed">{currentUser.bio}</p>
                      </div>
                    )}
                    
                    {currentUser.experience && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Experience & Background</h3>
                        <p className="text-gray-600 leading-relaxed">{currentUser.experience}</p>
                      </div>
                    )}
                    
                    {currentUser.specializations && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.specializations.split(',').map((spec, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                            >
                              {spec.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!currentUser.bio && !currentUser.experience && !currentUser.specializations && (
                  <div className="pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500 mb-4">Complete your profile to help students and faculty know more about you!</p>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Complete Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Recruitment Drive Management View
  if (currentView === 'recruitment') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Recruitment Drives</h1>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Active Drives</h2>
          {clubDrives.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recruitment drives created yet.</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Create New Drive
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {clubDrives.map(drive => (
                <div key={drive.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{drive.title}</h3>
                      <p className="text-sm text-gray-600">{drive.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      drive.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {drive.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <p className="font-medium">{new Date(drive.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <p className="font-medium">{new Date(drive.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Applications:</span>
                      <p className="font-medium">{drive.currentApplications}/{drive.maxApplications}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Questions:</span>
                      <p className="font-medium">{drive.questions.length} questions</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Applications Management View
  if (currentView === 'applications') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Applications</h2>
          </div>
          
          {clubApplications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No applications yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {clubApplications.map(app => (
                <div key={app.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-800">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">{app.studentEmail}</p>
                      <p className="text-xs text-gray-500">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === APPLICATION_STATUS.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === APPLICATION_STATUS.UNDER_REVIEW
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === APPLICATION_STATUS.ACCEPTED
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  {selectedApp === app.id && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Application Responses</h4>
                      {Object.entries(app.responses).map(([question, answer]) => (
                        <div key={question} className="mb-3">
                          <p className="text-sm font-medium text-gray-700">{question}</p>
                          <p className="text-sm text-gray-600 mt-1">{answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      {selectedApp === app.id ? 'Hide Details' : 'View Details'}
                    </button>
                    
                    {app.status === APPLICATION_STATUS.PENDING && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, APPLICATION_STATUS.UNDER_REVIEW)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, APPLICATION_STATUS.ACCEPTED)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, APPLICATION_STATUS.REJECTED)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {app.status === APPLICATION_STATUS.UNDER_REVIEW && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, APPLICATION_STATUS.ACCEPTED)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, APPLICATION_STATUS.REJECTED)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Club Head Dashboard</h1>
          <p className="text-gray-600">{userClub?.name || 'No club assigned'}</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('applications')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Applications
              </div>
              <p className="text-sm text-green-100 mt-1 ml-8">Review and manage student applications</p>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Club Profile
              </div>
              <p className="text-sm text-purple-100 mt-1 ml-8">View and edit club profile</p>
            </button>
           </div>
              </div>
{/* Recent Applications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Applications</h2>
              {clubApplications.slice(0, 3).length === 0 ? (
                <p className="text-gray-500">No recent applications</p>
 ) : (
      <div className="space-y-3">
      {clubApplications.slice(0, 3).map(app => (
          <div key={app.id} className="flex items-center justify-between">
          <div>
                 <p className="text-sm font-medium text-gray-800">{app.studentName}</p>
                 <p className="text-xs text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</p>
               </div>
               <span className={`px-2 py-1 text-xs rounded-full ${
                 app.status === APPLICATION_STATUS.PENDING
                   ? 'bg-yellow-100 text-yellow-800'
                   : app.status === APPLICATION_STATUS.ACCEPTED
                   ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
}`}>
                {app.status}
                 </span>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubHeadDashboard;