// src/components/student/StudentDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../StatsCard';
// *** ADDED: Import icons for the new UI ***
import { CheckCircle2, Clock, XCircle } from 'lucide-react'; 
// Import mock data
import { mockApplications, mockClubs, APPLICATION_STATUS } from '../../data/mockData'; // Adjust this path if needed

// *** ADDED: Helper object for styling application status ***
const statusStyles = {
  approved: {
    icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-100',
    label: 'Accepted'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-700',
    bg: 'bg-red-100',
    label: 'Rejected'
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    label: 'Pending'
  }
};


const StudentDashboard = ({ currentView, setCurrentView }) => {
  const { currentUser } = useAuth(); // Removed unused getAuthHeaders
  const [applications, setApplications] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [openClubs, setOpenClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [applicationForm, setApplicationForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
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

  // Mock Fetch applications
  const fetchApplications = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      await new Promise(res => setTimeout(res, 300)); 
      const userApps = mockApplications.filter(app => app.studentId === currentUser.id);
      const populatedApps = userApps.map(app => ({
        ...app,
        createdAt: app.applicationDate, 
        club: mockClubs.find(c => c.id === app.clubId) || { name: app.clubName, id: app.clubId }
      }));
      setApplications(populatedApps || []);
    } catch (error) {
      console.error('Error fetching mock applications:', error);
      setApplications([]);
    }
  }, [currentUser?.id]);

  // Mock Fetch clubs
  const fetchClubs = useCallback(async () => {
    try {
      await new Promise(res => setTimeout(res, 300)); 
      setClubs(mockClubs || []);
      setOpenClubs(mockClubs.filter(club => club.status === 'recruiting')); 
    } catch (error) {
      console.error('Error fetching mock clubs:', error);
      setClubs([]);
      setOpenClubs([]);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setError(null);
        await Promise.all([
          fetchApplications(),
          fetchClubs()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [currentUser, fetchApplications, fetchClubs]);

  // Initialize profile form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        branch: currentUser.branch || '',
        year: currentUser.year || '',
        rollNumber: currentUser.rollNumber || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        skills: currentUser.skills?.join(', ') || '',
        interests: currentUser.interests?.join(', ') || ''
      });
    }
  }, [currentUser]);

  // Profile form handlers
  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mock profile save
  const handleProfileSave = async () => {
    setProfileSaving(true);
    console.log('MOCK SAVE: Profile data to save:', profileForm);
    await new Promise(res => setTimeout(res, 750)); 
    try {
      alert('Profile updated successfully! (Mock)');
      setIsEditingProfile(false);
    } catch (err) {
       alert('Failed to update profile. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const cancelProfileEdit = () => {
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      branch: currentUser.branch || '',
      year: currentUser.year || '',
      rollNumber: currentUser.rollNumber || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      skills: currentUser.skills?.join(', ') || '',
      interests: currentUser.interests?.join(', ') || ''
    });
    setIsEditingProfile(false);
  };

  // Get available clubs that student hasn't applied to
  const getAvailableClubs = () => {
    const appliedClubIds = applications.map(app => app.club?.id);
    return openClubs.filter(club => !appliedClubIds.includes(club.id));
  };

  // Mock application submission
  const submitApplication = async (clubId) => {
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 750)); 

    try {
      const clubToApply = clubs.find(c => c.id === clubId);
      if (!clubToApply) {
        throw new Error('Club not found');
      }
      const newApp = {
        id: Date.now(),
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        clubId: clubToApply.id,
        clubName: clubToApply.name,
        applicationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(), 
        status: APPLICATION_STATUS.PENDING,
        motivation: applicationForm['q1'] || 'No answer provided', 
        skills: [], 
        club: clubToApply, 
      };

      setApplications(prevApps => [...prevApps, newApp]);
      setSelectedClub(null);
      setApplicationForm({});
      alert('Application submitted successfully! (Mock)');
    } catch (err) {
      console.error('Error submitting mock application:', err);
      alert(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Please log in to access the dashboard</div>
      </div>
    );
  }

  const availableClubs = getAvailableClubs();

  // Profile section content constant
  const profileSectionContent = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        {!isEditingProfile && (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Edit
          </button>
        )}
      </div>
      {isEditingProfile ? (
        // Edit Profile Form
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <input
              type="text"
              value={profileForm.branch}
              onChange={(e) => handleProfileChange('branch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="text"
              value={profileForm.year}
              onChange={(e) => handleProfileChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
            <input
              type="text"
              value={profileForm.rollNumber}
              onChange={(e) => handleProfileChange('rollNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              rows={4}
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
                {currentUser.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentUser.name}
              </h2>
              <p className="text-gray-600">
                {currentUser.branch || 'N/A'} • {currentUser.year || 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                  <p className="text-gray-800">{currentUser.email}</p>
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
          <div className="space-y-4 pt-6 border-t border-gray-200">
            {currentUser.bio && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">About Me</h3>
                <p className="text-gray-600 leading-relaxed">{currentUser.bio}</p>
              </div>
            )}
            {currentUser.skills?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {currentUser.interests?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {(!currentUser.bio && !currentUser.skills?.length && !currentUser.interests?.length) && (
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
    </>
  );

  // Applications/Clubs section content constant
  const applicationsSectionContent = (
    <>
      {/* *** UPDATED: "My Applications" section with new card UI *** */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applications yet. Browse available clubs to apply!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applications.map(app => {
              const style = statusStyles[app.status] || statusStyles.pending;
              const Icon = style.icon;
              return (
                <div key={app.id} className="rounded-lg border bg-gray-50 p-5 shadow-sm">
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{app.club?.name || app.clubName}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.color}`}>
                      <Icon className="w-4 h-4 mr-1.5" />
                      {style.label}
                    </span>
                  </div>
                  
                  {/* Meta Info */}
                  <p className="text-sm text-gray-500 mb-4">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  {/* Motivation/Answer Content */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Your motivation:</p>
                    <blockquote className="text-sm text-gray-600 italic bg-white p-3 rounded border border-gray-200 shadow-inner">
                      "{app.motivation || 'N/A'}"
                    </blockquote>
                  </div>

                  {/* Feedback (if any) */}
                  {app.feedback && (
                    <div className="border-t border-gray-200 pt-3 mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Club Feedback:</p>
                      <p className="text-sm text-gray-600">{app.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Clubs (This section remains unchanged) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Clubs</h2>
        {availableClubs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No available clubs at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {availableClubs.map(club => (
              <div key={club.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Category: {club.category || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Conditional render function
  const renderMainContent = () => {
    switch (currentView) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            {profileSectionContent}
          </div>
        );
      
      case 'applications':
      case 'dashboard':
      default:
        return (
          <div className="space-y-8">
            {applicationsSectionContent}
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome, {currentUser.name}</p>
      </div>

      {/* Stats Cards - Only show on dashboard view */}
      {currentView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Applications" value={applications.length} icon="📝" />
          <StatsCard title="Pending" value={applications.filter(a => a.status === 'pending').length} icon="⏳" />
          <StatsCard title="Accepted" value={applications.filter(a => a.status === 'approved').length} icon="✅" />
          <StatsCard title="Available Clubs" value={availableClubs.length} icon="🏫" />
        </div>
      )}

      {/* Main Content */}
      {renderMainContent()}

      {/* Application Modal */}
      {selectedClub && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Apply to {selectedClub.name}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); submitApplication(selectedClub.id); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Why do you want to join?</label>
                  <textarea
                    className="w-full border rounded-md p-2"
                    rows={4}
                    value={applicationForm['q1'] || ''}
                    onChange={(e) => handleFormChange('q1', e.target.value)}
                    required
                    placeholder="Tell the club why you're a good fit..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;