const express = require('express');
const router = express.Router();
const RecruitmentDriveController = require('../controllers/RecruitmentDriveController');

// Initialize controller (you'll need to pass your database instance)
const recruitmentController = new RecruitmentDriveController(/* your db instance */);

// Middleware to authenticate users (implement according to your auth system)
const authenticateUser = (req, res, next) => {
    // Your authentication logic here
    // This should set req.user with user data
    next();
};

// Middleware to check if user is a club head
const authenticateClubHead = (req, res, next) => {
    // Your club head verification logic here
    next();
};

// ===== CLUB HEAD ROUTES =====

// Get all recruitment drives for a club
router.get('/recruitment-drives/club/:clubId', 
    authenticateUser, 
    authenticateClubHead,
    (req, res) => recruitmentController.getClubDrives(req, res)
);

// Create new recruitment drive
router.post('/recruitment-drives', 
    authenticateUser,
    authenticateClubHead,
    (req, res) => recruitmentController.createDrive(req, res)
);

// Update recruitment drive
router.put('/recruitment-drives/:driveId', 
    authenticateUser,
    authenticateClubHead,
    (req, res) => recruitmentController.updateDrive(req, res)
);

// Delete recruitment drive
router.delete('/recruitment-drives/:driveId', 
    authenticateUser,
    authenticateClubHead,
    (req, res) => recruitmentController.deleteDrive(req, res)
);

// Toggle drive status (active/inactive)
router.patch('/recruitment-drives/:driveId/toggle-status', 
    authenticateUser,
    authenticateClubHead,
    (req, res) => recruitmentController.toggleDriveStatus(req, res)
);

// ===== STUDENT ROUTES =====

// Get all active recruitment drives (for students)
router.get('/recruitment-drives/active', 
    authenticateUser,
    (req, res) => recruitmentController.getActiveDrives(req, res)
);

// Get specific recruitment drive details with questions
router.get('/recruitment-drives/:driveId/details', 
    authenticateUser,
    async (req, res) => {
        try {
            const { driveId } = req.params;
            const db = recruitmentController.db;

            const drive = await db.query(`
                SELECT rd.*, c.name as club_name, c.category
                FROM recruitment_drives rd
                JOIN clubs c ON rd.club_id = c.id
                WHERE rd.id = ? AND rd.is_active = true 
                  AND rd.start_date <= CURDATE() 
                  AND rd.end_date >= CURDATE()
            `, [driveId]);

            if (drive.length === 0) {
                return res.status(404).json({ message: 'Drive not found or not active' });
            }

            // Get questions
            const questions = await db.query(`
                SELECT id, question_text as question, question_type as type,
                       is_required as required, options, order_index
                FROM recruitment_questions
                WHERE recruitment_drive_id = ?
                ORDER BY order_index ASC
            `, [driveId]);

            const driveWithQuestions = {
                ...drive[0],
                questions: questions.map(q => ({
                    ...q,
                    options: q.options ? JSON.parse(q.options) : []
                }))
            };

            res.json({ drive: driveWithQuestions });
        } catch (error) {
            console.error('Get drive details error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Submit application
router.post('/applications', 
    authenticateUser,
    (req, res) => recruitmentController.submitApplication(req, res)
);

// Get student's applications
router.get('/applications/student/:studentId', 
    authenticateUser,
    async (req, res) => {
        try {
            const { studentId } = req.params;
            const db = recruitmentController.db;

            // Verify user can access these applications
            if (req.user.id !== parseInt(studentId) && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            const applications = await db.query(`
                SELECT a.*, rd.title as drive_title, c.name as club_name,
                       rd.start_date, rd.end_date
                FROM applications a
                JOIN recruitment_drives rd ON a.recruitment_drive_id = rd.id
                JOIN clubs c ON a.club_id = c.id
                WHERE a.student_id = ?
                ORDER BY a.submitted_at DESC
            `, [studentId]);

            res.json({ applications });
        } catch (error) {
            console.error('Get student applications error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Get application details with responses
router.get('/applications/:applicationId/details', 
    authenticateUser,
    async (req, res) => {
        try {
            const { applicationId } = req.params;
            const db = recruitmentController.db;

            // Get application with drive and club info
            const application = await db.query(`
                SELECT a.*, rd.title as drive_title, c.name as club_name,
                       rd.description as drive_description
                FROM applications a
                JOIN recruitment_drives rd ON a.recruitment_drive_id = rd.id
                JOIN clubs c ON a.club_id = c.id
                WHERE a.id = ?
            `, [applicationId]);

            if (application.length === 0) {
                return res.status(404).json({ message: 'Application not found' });
            }

            // Verify user can access this application
            if (req.user.id !== application[0].student_id && 
                req.user.id !== application[0].reviewed_by &&
                req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Get questions and responses
            const responses = await db.query(`
                SELECT rq.question_text as question, ar.response_text as response,
                       rq.question_type as type, rq.options
                FROM application_responses ar
                JOIN recruitment_questions rq ON ar.question_id = rq.id
                WHERE ar.application_id = ?
                ORDER BY rq.order_index ASC
            `, [applicationId]);

            const applicationDetails = {
                ...application[0],
                responses: responses.map(r => ({
                    ...r,
                    options: r.options ? JSON.parse(r.options) : []
                }))
            };

            res.json({ application: applicationDetails });
        } catch (error) {
            console.error('Get application details error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// ===== ADMIN/CLUB HEAD APPLICATION MANAGEMENT ROUTES =====

// Get applications for a specific drive
router.get('/recruitment-drives/:driveId/applications', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const { driveId } = req.params;
            const { status, search, page = 1, limit = 10 } = req.query;
            const db = recruitmentController.db;

            // Verify user owns this drive
            const drive = await db.query(
                'SELECT * FROM recruitment_drives WHERE id = ? AND club_head_id = ?',
                [driveId, req.user.id]
            );

            if (drive.length === 0) {
                return res.status(403).json({ message: 'Access denied' });
            }

            let query = `
                SELECT a.*, u.name as student_name, u.email as student_email,
                       u.student_id as student_number
                FROM applications a
                JOIN users u ON a.student_id = u.id
                WHERE a.recruitment_drive_id = ?
            `;
            const params = [driveId];

            if (status) {
                query += ' AND a.status = ?';
                params.push(status);
            }

            if (search) {
                query += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.student_id LIKE ?)';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY a.submitted_at DESC';
            
            // Add pagination
            const offset = (page - 1) * limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limit), parseInt(offset));

            const applications = await db.query(query, params);

            // Get total count for pagination
            let countQuery = `
                SELECT COUNT(*) as total
                FROM applications a
                JOIN users u ON a.student_id = u.id
                WHERE a.recruitment_drive_id = ?
            `;
            const countParams = [driveId];

            if (status) {
                countQuery += ' AND a.status = ?';
                countParams.push(status);
            }

            if (search) {
                countQuery += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.student_id LIKE ?)';
                countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }

            const totalResult = await db.query(countQuery, countParams);
            const total = totalResult[0].total;

            res.json({
                applications,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            });
        } catch (error) {
            console.error('Get drive applications error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Update application status
router.patch('/applications/:applicationId/status', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const { applicationId } = req.params;
            const { status, notes = '' } = req.body;
            const db = recruitmentController.db;

            // Verify valid status
            const validStatuses = ['pending', 'under_review', 'accepted', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            // Verify user owns the drive this application belongs to
            const application = await db.query(`
                SELECT a.*, rd.club_head_id
                FROM applications a
                JOIN recruitment_drives rd ON a.recruitment_drive_id = rd.id
                WHERE a.id = ?
            `, [applicationId]);

            if (application.length === 0) {
                return res.status(404).json({ message: 'Application not found' });
            }

            if (application[0].club_head_id !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Update application status
            await db.query(`
                UPDATE applications 
                SET status = ?, notes = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
                WHERE id = ?
            `, [status, notes, req.user.id, applicationId]);

            // Get updated application
            const updatedApplication = await db.query(
                'SELECT * FROM applications WHERE id = ?',
                [applicationId]
            );

            res.json(updatedApplication[0]);
        } catch (error) {
            console.error('Update application status error:', error);
            res.status(500).json({ message: 'Failed to update application status' });
        }
    }
);

module.exports = router;