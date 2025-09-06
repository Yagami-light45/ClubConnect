// Core MVP Features Overview
// \workspace\dashboard\src\components\clubhead\ClubHeadRecruitmentSystem.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { Plus, Save, X, FileText, Calendar } from 'lucide-react'; // Added icons for the UI

const ClubHeadRecruitmentSystem = () => {
    const { currentUser } = useAuth();
    const [drives, setDrives] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Requirements are stored as a string in the textarea, but will be split into an array on submit.
    const [requirementsText, setRequirementsText] = useState("");
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
    });

    // Define the data fetching logic with useCallback to stabilize it
    const fetchDrives = useCallback(async () => {
        if (!currentUser || !currentUser.clubId) {
            return; // Don't fetch if user data or clubId is missing
        }
        try {
            const response = await api.get(`/recruitment-drives/club/${currentUser.clubId}`);
            setDrives(response.data.drives || []); // Ensure drives is always an array
        } catch (error) {
            console.error('Fetch drives error:', error);
            setDrives([]); // Set to empty array on error
        }
    }, [currentUser]);

    // Call fetchDrives when the component mounts or the fetchDrives function (and its dependency, currentUser) changes.
    useEffect(() => {
        fetchDrives();
    }, [fetchDrives]);

    // Define the missing resetForm function
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            deadline: '',
        });
        setRequirementsText("");
    };

    // Add a generic input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Corrected create drive handler using the 'api' instance
    const handleCreateDrive = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true);

        // Split requirements text by newline, trim whitespace, and filter empty lines
        const requirementsArray = requirementsText
            .split('\n')
            .map(req => req.trim())
            .filter(req => req.length > 0);

        const driveData = {
            ...formData,
            requirements: requirementsArray,
            clubId: currentUser.clubId // Explicitly add clubId from context
        };

        try {
            // Use the consistent 'api' wrapper for the POST request
            await api.post('/recruitment-drives', driveData);

            // Refresh drives list after successful creation
            await fetchDrives(); 
            
            setShowCreateModal(false);
            resetForm();
            alert('Recruitment drive created successfully!');
        } catch (error) {
            console.error('Create drive error:', error);
            alert(error.response?.data?.message || 'Failed to create recruitment drive');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ADDED: A minimal return statement to make the component functional
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Recruitment Drives</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Create Drive
                </button>
            </div>

            {/* Drives List */}
            <div className="space-y-4">
                {drives.length > 0 ? (
                    drives.map(drive => (
                        <div key={drive.id} className="bg-white p-5 rounded-lg shadow border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">{drive.title}</h3>
                            <p className="text-gray-600 mt-2">{drive.description}</p>
                            <div className="flex items-center gap-2 text-red-600 mt-4 text-sm">
                                <Calendar size={14} />
                                <span className="font-medium">Deadline:</span>
                                <span>{new Date(drive.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    {(drive.requirements || []).map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border border-dashed">
                        <FileText size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500">No active recruitment drives found.</p>
                        <p className="text-gray-500">Click "Create Drive" to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleCreateDrive}>
                            <div className="flex justify-between items-center p-6 border-b">
                                <h3 className="text-xl font-semibold">Create New Recruitment Drive</h3>
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                 <div>
                                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                                    <input
                                        type="date"
                                        id="deadline"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        required
                                    />
                                </div>
                                 <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        rows={5}
                                        value={requirementsText}
                                        onChange={(e) => setRequirementsText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g., Must know React&#nCompleted Data Structures course&#nAvailable for 5 hours/week"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : <><Save size={16} /> Create Drive</>}
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