// src/components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClubs, mockApplications, mockRecruitmentDrives, APPLICATION_STATUS, CLUB_STATUS } from '../../data/mockData';
import StatsCard from '../StatsCard';

const StudentDashboard = ({ currentView, setCurrentView }) => {
  const authContext = useAuth();
  const currentUser = authContext?.currentUser;
  
  const [applications, setApplications] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [applicationForm, setApplicationForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Profile management state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    branch: '',
    year: '',
    rollNumber: '',
    phone: '',
    bio: '',
    skills: '',
    interests: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    try {
      setApplications(mockApplications || []);
      
      // Initialize profile form with current user data
      if (currentUser) {
        setProfileForm({
          name: currentUser.name || '',
          email: currentUser.email || '',
          branch: currentUser.branch || '',
          year: currentUser.year || '',
          rollNumber: currentUser.rollNumber || '',
          phone: currentUser.phone || '',
          bio: currentUser.bio || '',
          skills: currentUser.skills || '',
          interests: currentUser.interests || ''
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load application data');
      setLoading(false);
    }
  }, [currentUser]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Authentication check
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Please log in to access the dashboard</div>
      </div>
    );
  }

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
      // For now, we'll just simulate success
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
      branch: currentUser.branch || '',
      year: currentUser.year || '',
      rollNumber: currentUser.rollNumber || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      skills: currentUser.skills || '',
      interests: currentUser.interests || ''
    });
    setIsEditingProfile(false);
  };

  // Get student's applications with safety checks
  const studentApplications = applications.filter(app => 
    app && app.studentId === currentUser.id
  ) || [];
  
  const availableClubs = (mockClubs || []).filter(club => 
    club &&
    club.status === CLUB_STATUS.APPROVED && 
    club.isRecruiting &&
    !studentApplications.some(app => app.clubId === club.id)
  );

  // Calculate stats with error handling
  const getStatsValue = (count) => (count || 0).toString();
  
  const stats = [
    {
      title: 'My Applications',
      value: getStatsValue(studentApplications.length),
      change: '+1',
      trend: 'up',
      icon: { 
        path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-blue-500'
      }
    },
    {
      title: 'Pending',
      value: getStatsValue(studentApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length),
      change: '0',
      trend: 'up',
      icon: { 
        path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-yellow-500'
      }
    },
    {
      title: 'Accepted',
      value: getStatsValue(studentApplications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length),
      change: '+1',
      trend: 'up',
      icon: { 
        path: 'M5 13l4 4L19 7',
        bgColor: 'bg-green-500'
      }
    },
    {
      title: 'Available Clubs',
      value: getStatsValue(availableClubs.length),
      change: '0',
      trend: 'up',
      icon: { 
        path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        bgColor: 'bg-purple-500'
      }
    }
  ];

  const submitApplication = (clubId) => {
    try {
      const club = (mockClubs || []).find(c => c && c.id === clubId);
      const drive = (mockRecruitmentDrives || []).find(d => 
        d && d.clubId === clubId && d.isActive
      );
      
      if (!club) {
        alert('Club not found');
        return;
      }
      
      if (!drive) {
        alert('No active recruitment drive for this club');
        return;
      }

      // Validate required fields
      const requiredQuestions = (drive.questions || []).filter(q => q && q.required);
      const missingAnswers = requiredQuestions.filter(q => !applicationForm[q.id]);
      
      if (missingAnswers.length > 0) {
        alert('Please answer all required questions');
        return;
      }

      // Create application
      const newApplication = {
        id: Date.now(),
        studentId: currentUser.id,
        studentName: currentUser.name || 'Unknown',
        studentEmail: currentUser.email || 'unknown@email.com',
        clubId: clubId,
        clubName: club.name || 'Unknown Club',
        status: APPLICATION_STATUS.PENDING,
        appliedAt: new Date().toISOString(),
        responses: (drive.questions || []).reduce((acc, q) => {
          if (q && q.question) {
            acc[q.question] = applicationForm[q.id] || '';
          }
          return acc;
        }, {}),
        resumeUrl: null
      };

      setApplications(prevApps => [...prevApps, newApplication]);
      setSelectedClub(null);
      setApplicationForm({});
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleFormChange = (questionId, value) => {
    setApplicationForm(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const resetForm = () => {
    setSelectedClub(null);
    setApplicationForm({});
  };

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
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
                      Branch/Department
                    </label>
                    <select
                      value={profileForm.branch}
                      onChange={(e) => handleProfileChange('branch', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Information Technology">Information Technology</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study
                    </label>
                    <select
                      value={profileForm.year}
                      onChange={(e) => handleProfileChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.rollNumber}
                      onChange={(e) => handleProfileChange('rollNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.skills}
                    onChange={(e) => handleProfileChange('skills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., JavaScript, Python, Leadership, Public Speaking"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.interests}
                    onChange={(e) => handleProfileChange('interests', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Technology, Music, Sports, Photography"
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
                      {currentUser.branch || 'No branch specified'} • {currentUser.year || 'Year not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email Address</span>
                        <p className="text-gray-800">{currentUser.email || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Roll Number</span>
                        <p className="text-gray-800">{currentUser.rollNumber || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <p className="text-gray-800">{currentUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Academic Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Branch/Department</span>
                        <p className="text-gray-800">{currentUser.branch || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year of Study</span>
                        <p className="text-gray-800">{currentUser.year || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(currentUser.bio || currentUser.skills || currentUser.interests) && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    {currentUser.bio && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">About Me</h3>
                        <p className="text-gray-600 leading-relaxed">{currentUser.bio}</p>
                      </div>
                    )}
                    
                    {currentUser.skills && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentUser.interests && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.interests.split(',').map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                            >
                              {interest.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!currentUser.bio && !currentUser.skills && !currentUser.interests && (
                  <div className="pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500 mb-4">Complete your profile to help clubs get to know you better!</p>
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

  // Club Browse View
  if (currentView === 'browse-clubs') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Browse Clubs</h1>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        
        {availableClubs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No clubs are currently accepting applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableClubs.map(club => (
              <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {club.image && (
                  <img 
                    src={club.image} 
                    alt={club.name || 'Club image'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-800">
                      {club.name || 'Unnamed Club'}
                    </h3>
                    {club.category && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {club.category}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {club.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    {club.headName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Club Head:</span>
                        <span className="text-gray-800">{club.headName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Members:</span>
                      <span className="text-gray-800">
                        {club.currentMembers || 0}/{club.maxMembers || 'N/A'}
                      </span>
                    </div>
                    {club.requirements && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requirements:</span>
                        <span className="text-gray-800 text-xs">{club.requirements}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedClub(club.id)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Application Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {(() => {
                const club = (mockClubs || []).find(c => c && c.id === selectedClub);
                const drive = (mockRecruitmentDrives || []).find(d => 
                  d && d.clubId === selectedClub && d.isActive
                );
                
                if (!club) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-red-500">Club not found.</p>
                      <button
                        onClick={resetForm}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  );
                }
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Apply to {club.name || 'Club'}
                      </h2>
                      <button
                        onClick={resetForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {drive && drive.questions ? (
                      <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        submitApplication(selectedClub); 
                      }}>
                        <div className="space-y-4">
                          {drive.questions.map(question => {
                            if (!question || !question.id) return null;
                            
                            return (
                              <div key={question.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {question.question || 'Question'}
                                  {question.required && <span className="text-red-500">*</span>}
                                </label>
                                {question.type === 'textarea' ? (
                                  <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={applicationForm[question.id] || ''}
                                    onChange={(e) => handleFormChange(question.id, e.target.value)}
                                    required={question.required}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={applicationForm[question.id] || ''}
                                    onChange={(e) => handleFormChange(question.id, e.target.value)}
                                    required={question.required}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            Submit Application
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No active recruitment drive for this club.</p>
                        <button
                          onClick={resetForm}
                          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Application Status View
  if (currentView === 'my-applications') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">My Applications</h1>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {studentApplications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">You haven't applied to any clubs yet.</p>
              <button
                onClick={() => setCurrentView('browse-clubs')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Browse Clubs
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {studentApplications.map(app => {
                if (!app || !app.id) return null;
                
                return (
                  <div key={app.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {app.clubName || 'Unknown Club'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        app.status === APPLICATION_STATUS.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : app.status === APPLICATION_STATUS.UNDER_REVIEW
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === APPLICATION_STATUS.ACCEPTED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status ? app.status.replace('_', ' ') : 'Unknown'}
                      </span>
                    </div>
                    
                    {app.responses && Object.keys(app.responses).length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Your Responses:</h4>
                        {Object.entries(app.responses).map(([question, answer]) => (
                          <div key={question} className="mb-2">
                            <p className="text-xs font-medium text-gray-600">{question}</p>
                            <p className="text-sm text-gray-800">{answer || 'No answer provided'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {app.status === APPLICATION_STATUS.ACCEPTED && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Congratulations! You've been accepted to {app.clubName || 'the club'}. 
                          Check your email for next steps.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
          <h1 className="text-2xl font-semibold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name || 'Student'}!</p>
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
              onClick={() => setCurrentView('browse-clubs')}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Clubs
              </div>
              <p className="text-sm text-indigo-100 mt-1 ml-8">Discover and apply to clubs</p>
            </button>
            
            <button
              onClick={() => setCurrentView('my-applications')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Applications
              </div>
              <p className="text-sm text-green-100 mt-1 ml-8">Track your application status</p>
            </button>
            
            <button
              onClick={() => setCurrentView('profile')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </div>
              <p className="text-sm text-purple-100 mt-1 ml-8">View and edit your profile</p>
            </button>
          </div>
        </div>
        
        {/* Application Status Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Application Status</h2>
          {studentApplications.length === 0 ? (
            <p className="text-gray-500">No applications submitted yet</p>
          ) : (
            <div className="space-y-3">
              {studentApplications.slice(0, 3).map(app => {
                if (!app || !app.id) return null;
                
                return (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {app.clubName || 'Unknown Club'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Unknown date'}
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
                      {app.status ? app.status.replace('_', ' ') : 'Unknown'}
                    </span>
                  </div>
                );
              })}
              {studentApplications.length > 3 && (
                <button
                  onClick={() => setCurrentView('my-applications')}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View all applications ({studentApplications.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Available Clubs Preview */}
      {availableClubs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Clubs Accepting Applications</h2>
            <button
              onClick={() => setCurrentView('browse-clubs')}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableClubs.slice(0, 3).map(club => {
              if (!club || !club.id) return null;
              
              return (
                <div key={club.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {club.name || 'Unnamed Club'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {club.category || 'Uncategorized'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {club.description ? 
                      `${club.description.substring(0, 100)}...` : 
                      'No description available'
                    }
                  </p>
                  <button
                    onClick={() => setCurrentView('browse-clubs')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;