// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import ClubHeadDashboard from './components/clubhead/ClubHeadDashboard';
import ClubHeadRecruitmentSystem from './components/clubhead/ClubHeadRecruitmentSystem';
import StudentDashboard from './components/student/StudentDashboard';
import NotificationCenter from './components/shared/NotificationCenter';
import { ROLES } from './data/mockData';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
    const { currentUser, loading } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);

    if (loading) {
        return <LoadingSpinner />;
    }

    const renderDashboard = () => {
        if (!currentUser) return null;

        console.log('Current user role:', currentUser.role); // Debug log
        console.log('Available ROLES:', ROLES); // Debug log

        switch (currentUser.role) {
            case ROLES.ADMIN:
            case 'admin': // Also check string value in case ROLES constant doesn't match
                return <AdminDashboard currentView={currentView} setCurrentView={setCurrentView} />;
            
            case ROLES.CLUB_HEAD:
            case 'clubhead': // Also check string value
                return currentView === 'recruitment' ? 
                    <ClubHeadRecruitmentSystem /> : 
                    <ClubHeadDashboard currentView={currentView} setCurrentView={setCurrentView} />;
            
            case ROLES.STUDENT:
            case 'student': // Also check string value
                return <StudentDashboard currentView={currentView} setCurrentView={setCurrentView} />;
            
            default:
                return (
                    <div className="text-center p-8">
                        <h2 className="text-xl font-semibold text-gray-700">Unknown Role</h2>
                        <p className="text-gray-500 mt-2">
                            Role: {currentUser.role} is not recognized.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Available roles: {Object.values(ROLES).join(', ')}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                userRole={currentUser?.role} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    showNotifications={showNotifications} 
                    setShowNotifications={setShowNotifications}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {renderDashboard()}
                </main>
                {showNotifications && (
                    <NotificationCenter 
                        isOpen={showNotifications} 
                        onClose={() => setShowNotifications(false)} 
                    />
                )}
            </div>
        </div>
    );
};

const App = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default App;