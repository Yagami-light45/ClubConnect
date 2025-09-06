import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Save, X, FileText, Calendar, Users, Clock, Edit, Trash2, Eye } from 'lucide-react';

const ClubHeadRecruitmentSystem = () => {
    const { currentUser, getAuthHeaders } = useAuth();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    
    const [requirementsText, setRequirementsText] = useState("");
    const [customQuestionsText, setCustomQuestionsText] = useState("");
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        maxApplications: '',
        isActive: true
    });

    // API base URL - adjust according to your backend
 
const API_BASE_URL = 'http://localhost:5000/api';

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 5000);
    };

    // API helper functions
    const apiCall = async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
               headers: {
                    ...getAuthHeaders(), // This function provides the correct token
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

    // Fetch recruitment drives
    const fetchDrives = useCallback(async () => {
        if (!currentUser?.clubId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await apiCall(`/recruitment-drives/club/${currentUser.clubId}`);
            setDrives(data.drives || data || []);
        } catch (error) {
            setError(error.message);
            setDrives([]);
        } finally {
            setLoading(false);
        }
    }, [currentUser?.clubId, currentUser?.token]);

    // Load drives on component mount
    useEffect(() => {
        fetchDrives();
    }, [fetchDrives]);

    // Form handlers
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            deadline: '',
            maxApplications: '',
            isActive: true
        });
        setRequirementsText("");
        setCustomQuestionsText("");
        setEditingDrive(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Prepare form data for submission
    const prepareFormData = () => {
        const requirementsArray = requirementsText
            .split('\n')
            .map(req => req.trim())
            .filter(req => req.length > 0);

        const customQuestionsArray = customQuestionsText
            .split('\n')
            .map((q, index) => ({
                id: `q_${Date.now()}_${index}`,
                question: q.trim(),
                type: 'textarea',
                required: true
            }))
            .filter(q => q.question.length > 0);

        return {
            ...formData,
            requirements: requirementsArray,
            customQuestions: customQuestionsArray,
            clubId: currentUser.clubId,
            maxApplications: parseInt(formData.maxApplications) || 50,
            deadline: new Date(formData.deadline).toISOString()
        };
    };

    // Create new recruitment drive
    const handleCreateDrive = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const driveData = prepareFormData();
            await apiCall('/recruitment-drives', {
                method: 'POST',
                body: JSON.stringify(driveData)
            });

            await fetchDrives();
            setShowCreateModal(false);
            resetForm();
            showNotification('Recruitment drive created successfully!');
        } catch (error) {
            setError(error.message);
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update recruitment drive
    const handleUpdateDrive = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const driveData = prepareFormData();
            await apiCall(`/recruitment-drives/${editingDrive}`, {
                method: 'PUT',
                body: JSON.stringify(driveData)
            });

            await fetchDrives();
            setShowCreateModal(false);
            resetForm();
            showNotification('Recruitment drive updated successfully!');
        } catch (error) {
            setError(error.message);
            showNotification(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete recruitment drive
    const handleDeleteDrive = async (driveId) => {
        if (!window.confirm('Are you sure you want to delete this recruitment drive?')) {
            return;
        }

        try {
            await apiCall(`/recruitment-drives/${driveId}`, {
                method: 'DELETE'
            });

            await fetchDrives();
            showNotification('Recruitment drive deleted successfully!');
        } catch (error) {
            setError(error.message);
            showNotification(error.message, 'error');
        }
    };

    // Toggle drive active status
    const toggleDriveStatus = async (driveId, currentStatus) => {
        try {
            await apiCall(`/recruitment-drives/${driveId}/toggle-status`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus })
            });

            await fetchDrives();
            showNotification(`Drive ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (error) {
            setError(error.message);
            showNotification(error.message, 'error');
        }
    };

    // Edit drive handler
    const handleEditDrive = (drive) => {
        setEditingDrive(drive._id);
        setFormData({
            title: drive.title,
            description: drive.description,
            deadline: new Date(drive.deadline).toISOString().split('T')[0],
            maxApplications: drive.maxApplications.toString(),
            isActive: drive.isActive
        });
        setRequirementsText(drive.requirements?.join('\n') || '');
        setCustomQuestionsText(drive.customQuestions?.map(q => q.question).join('\n') || '');
        setShowCreateModal(true);
    };

    // Get applications count for a drive
    const getApplicationsCount = async (driveId) => {
        try {
            const data = await apiCall(`/applications/drive/${driveId}/count`);
            return data.count || 0;
        } catch (error) {
            return 0;
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading recruitment drives...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg ${
                    notification.type === 'error' 
                        ? 'bg-red-100 border border-red-400 text-red-700' 
                        : 'bg-green-100 border border-green-400 text-green-700'
                }`}>
                    <div className="flex items-center">
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="ml-3 text-sm"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recruitment Drives</h1>
                    <p className="text-gray-600 mt-1">Manage your club's recruitment campaigns</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Create Drive
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                        <strong>Error:</strong> {error}
                    </p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchDrives();
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Drives List */}
            <div className="space-y-4">
                {drives.length > 0 ? (
                    drives.map(drive => (
                        <div key={drive._id} className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                            drive.isActive ? 'border-green-500' : 'border-gray-400'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">{drive.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            drive.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {drive.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{drive.description}</p>
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditDrive(drive)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Drive"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleDriveStatus(drive._id, drive.isActive)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            drive.isActive 
                                                ? 'text-red-600 hover:bg-red-50' 
                                                : 'text-green-600 hover:bg-green-50'
                                        }`}
                                        title={drive.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {drive.isActive ? <X size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDrive(drive._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Drive"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Drive Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={14} />
                                    <span className="font-medium">Deadline:</span>
                                    <span className="text-red-600">
                                        {new Date(drive.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users size={14} />
                                    <span className="font-medium">Applications:</span>
                                    <span>{drive.currentApplications || 0}/{drive.maxApplications}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText size={14} />
                                    <span className="font-medium">Questions:</span>
                                    <span>{drive.customQuestions?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={14} />
                                    <span className="font-medium">Created:</span>
                                    <span>{new Date(drive.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Requirements */}
                            {drive.requirements && drive.requirements.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                                        {drive.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Custom Questions Preview */}
                            {drive.customQuestions && drive.customQuestions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                        Application Questions ({drive.customQuestions.length}):
                                    </h4>
                                    <div className="space-y-2">
                                        {drive.customQuestions.slice(0, 2).map((q, index) => (
                                            <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                {index + 1}. {q.question}
                                            </div>
                                        ))}
                                        {drive.customQuestions.length > 2 && (
                                            <div className="text-xs text-gray-500">
                                                +{drive.customQuestions.length - 2} more questions...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                        <FileText size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500 text-lg">No recruitment drives found</p>
                        <p className="text-gray-400 mb-6">Create your first drive to start recruiting members</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Drive
                        </button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={editingDrive ? handleUpdateDrive : handleCreateDrive}>
                            <div className="flex justify-between items-center p-6 border-b">
                                <h3 className="text-xl font-semibold">
                                    {editingDrive ? 'Edit Recruitment Drive' : 'Create New Recruitment Drive'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => { 
                                        setShowCreateModal(false); 
                                        resetForm(); 
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Drive Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Spring 2024 Recruitment"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                            Application Deadline *
                                        </label>
                                        <input
                                            type="date"
                                            id="deadline"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="maxApplications" className="block text-sm font-medium text-gray-700 mb-1">
                                            Maximum Applications
                                        </label>
                                        <input
                                            type="number"
                                            id="maxApplications"
                                            name="maxApplications"
                                            value={formData.maxApplications}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="50"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Describe what your club is looking for in new members..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                                        Requirements (one per line)
                                    </label>
                                    <textarea
                                        id="requirements"
                                        rows={5}
                                        value={requirementsText}
                                        onChange={(e) => setRequirementsText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Must have completed Data Structures course&#nAvailable for 5+ hours per week&#nStrong communication skills"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="customQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                                        Application Questions (one per line)
                                    </label>
                                    <textarea
                                        id="customQuestions"
                                        rows={6}
                                        value={customQuestionsText}
                                        onChange={(e) => setCustomQuestionsText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Why do you want to join our club?&#nWhat relevant experience do you have?&#nHow much time can you commit weekly?"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                        Make this drive active immediately
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => { 
                                        setShowCreateModal(false); 
                                        resetForm(); 
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            {editingDrive ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            {editingDrive ? 'Update Drive' : 'Create Drive'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubHeadRecruitmentSystem;