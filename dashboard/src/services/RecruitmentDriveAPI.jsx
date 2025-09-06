// Backend API service for recruitment drives
class RecruitmentDriveAPI {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
    }

    // Helper method for API calls
    async makeRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get auth token (implement your auth logic here)
    getAuthToken() {
        // Replace with your actual auth token retrieval logic
        return sessionStorage.getItem('authToken') || '';
    }

    // ===== CLUB HEAD ENDPOINTS =====

    // Get all recruitment drives for a club head
    async getClubHeadDrives(clubId) {
        return await this.makeRequest(`/recruitment-drives/club/${clubId}`);
    }

    // Create new recruitment drive
    async createRecruitmentDrive(driveData) {
        return await this.makeRequest('/recruitment-drives', {
            method: 'POST',
            body: JSON.stringify(driveData)
        });
    }

    // Update recruitment drive
    async updateRecruitmentDrive(driveId, driveData) {
        return await this.makeRequest(`/recruitment-drives/${driveId}`, {
            method: 'PUT',
            body: JSON.stringify(driveData)
        });
    }

    // Delete recruitment drive
    async deleteRecruitmentDrive(driveId) {
        return await this.makeRequest(`/recruitment-drives/${driveId}`, {
            method: 'DELETE'
        });
    }

    // Toggle drive status (active/inactive)
    async toggleDriveStatus(driveId) {
        return await this.makeRequest(`/recruitment-drives/${driveId}/toggle-status`, {
            method: 'PATCH'
        });
    }

    // Get applications for a specific drive
    async getDriveApplications(driveId, filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await this.makeRequest(`/recruitment-drives/${driveId}/applications?${queryString}`);
    }

    // Update application status
    async updateApplicationStatus(applicationId, status, notes = '') {
        return await this.makeRequest(`/applications/${applicationId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, notes })
        });
    }

    // ===== STUDENT ENDPOINTS =====

    // Get all active recruitment drives
    async getActiveRecruitmentDrives(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await this.makeRequest(`/recruitment-drives/active?${queryString}`);
    }

    // Get specific recruitment drive details with questions
    async getRecruitmentDriveDetails(driveId) {
        return await this.makeRequest(`/recruitment-drives/${driveId}/details`);
    }

    // Submit application
    async submitApplication(applicationData) {
        return await this.makeRequest('/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    }

    // Get student's applications
    async getStudentApplications(studentId) {
        return await this.makeRequest(`/applications/student/${studentId}`);
    }

    // Get application details with responses
    async getApplicationDetails(applicationId) {
        return await this.makeRequest(`/applications/${applicationId}/details`);
    }
}

export default RecruitmentDriveAPI;