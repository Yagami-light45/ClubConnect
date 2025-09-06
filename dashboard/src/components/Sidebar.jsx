import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
    Home, 
    Users, 
    ClipboardList, 
    Settings, 
    LogOut 
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
    const { currentUser, logout } = useAuth(); // ✅ Changed from 'user' to 'currentUser'

    const menuItems = {
        admin: [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'clubs', label: 'Club Management', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
        ],
        clubhead: [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'recruitment', label: 'Recruitment', icon: Users },
            { id: 'applicants', label: 'Applicants', icon: ClipboardList },
            { id: 'settings', label: 'Settings', icon: Settings }
        ],
        student: [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'applications', label: 'My Applications', icon: ClipboardList },
            { id: 'settings', label: 'Settings', icon: Settings }
        ]
    };

    const currentMenu = menuItems[currentUser?.role] || []; // ✅ Changed from 'user?.role' to 'currentUser?.role'

    // Debug log to see what's happening
    console.log('Sidebar - currentUser:', currentUser);
    console.log('Sidebar - currentUser role:', currentUser?.role);
    console.log('Sidebar - currentMenu:', currentMenu);

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="h-full flex flex-col">
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">Club Portal</h2>
                    {/* Debug info - remove this after fixing */}
                    {currentUser && (
                        <div className="text-xs text-gray-500 mt-1">
                            Role: {currentUser.role}
                        </div>
                    )}
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {currentMenu.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setCurrentView(id)}
                            className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                                currentView === id 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;