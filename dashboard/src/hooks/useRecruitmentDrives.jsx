import { useState, useEffect, useCallback } from 'react';
import RecruitmentDriveAPI from '../services/RecruitmentDriveAPI';

// Custom hook for recruitment drives management
export const useRecruitmentDrives = (clubId) => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const api = new RecruitmentDriveAPI();

    const fetchDrives = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getClubHeadDrives(clubId);
            setDrives(data.drives || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [clubId]);

    useEffect(() => {
        if (clubId) {
            fetchDrives();
        }
    }, [clubId, fetchDrives]);

    const createDrive = async (driveData) => {
        try {
            const newDrive = await api.createRecruitmentDrive({
                ...driveData,
                clubId
            });
            setDrives(prev => [newDrive, ...prev]);
            return { success: true, data: newDrive };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updateDrive = async (driveId, driveData) => {
        try {
            const updatedDrive = await api.updateRecruitmentDrive(driveId, driveData);
            setDrives(prev => prev.map(drive => 
                drive.id === driveId ? updatedDrive : drive
            ));
            return { success: true, data: updatedDrive };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteDrive = async (driveId) => {
        try {
            await api.deleteRecruitmentDrive(driveId);
            setDrives(prev => prev.filter(drive => drive.id !== driveId));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const toggleStatus = async (driveId) => {
        try {
            const updatedDrive = await api.toggleDriveStatus(driveId);
            setDrives(prev => prev.map(drive => 
                drive.id === driveId ? updatedDrive : drive
            ));
            return { success: true, data: updatedDrive };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return {
        drives,
        loading,
        error,
        createDrive,
        updateDrive,
        deleteDrive,
        toggleStatus,
        refetch: fetchDrives
    };
};

// Custom hook for student applications
export const useStudentApplications = (studentId) => {
    const [applications, setApplications] = useState([]);
    const [availableDrives, setAvailableDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const api = new RecruitmentDriveAPI();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [applicationsData, drivesData] = await Promise.all([
                api.getStudentApplications(studentId),
                api.getActiveRecruitmentDrives()
            ]);
            
            setApplications(applicationsData.applications || []);
            setAvailableDrives(drivesData.drives || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        if (studentId) {
            fetchData();
        }
    }, [studentId, fetchData]);

    const submitApplication = async (driveId, responses) => {
        try {
            const applicationData = {
                recruitmentDriveId: driveId,
                studentId,
                responses
            };
            
            const newApplication = await api.submitApplication(applicationData);
            setApplications(prev => [newApplication, ...prev]);
            
            // Remove the drive from available drives
            setAvailableDrives(prev => prev.filter(drive => drive.id !== driveId));
            
            return { success: true, data: newApplication };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return {
        applications,
        availableDrives,
        loading,
        error,
        submitApplication,
        refetch: fetchData
    };
};