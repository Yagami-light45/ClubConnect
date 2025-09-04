import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { USER_ROLES } from './utils/constants';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/shared/Navbar';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import ClubManagement from './components/admin/ClubManagement';

// Club Head Components
import ClubHeadDashboard from './components/clubhead/ClubHeadDashboard';
import ApplicantsList from './components/clubhead/ApplicantsList';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import ApplicationStatus from './components/student/ApplicationStatus';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (user.role) {
      case USER_ROLES.ADMIN:
        switch (activeTab) {
          case 'dashboard':
            return <AdminDashboard />;
          case 'clubs':
            return <ClubManagement />;
          default:
            return <AdminDashboard />;
        }
      
      case USER_ROLES.CLUB_HEAD:
        switch (activeTab) {
          case 'dashboard':
            return <ClubHeadDashboard />;
          case 'recruitment':
            return <ClubHeadDashboard />;
          case 'applicants':
            return <ApplicantsList />;
          default:
            return <ClubHeadDashboard />;
        }
      
      case USER_ROLES.STUDENT:
        switch (activeTab) {
          case 'dashboard':
            return <StudentDashboard />;
          case 'applications':
            return <ApplicationStatus />;
          default:
            return <StudentDashboard />;
        }
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Invalid Role</h2>
            <p className="text-gray-600">Please contact the administrator.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ProtectedRoute>
          {renderContent()}
        </ProtectedRoute>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;