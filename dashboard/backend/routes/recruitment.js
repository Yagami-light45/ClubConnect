// backend/routes/recruitment.js
const express = require('express');
const router = express.Router();
// Add your model imports here
// const RecruitmentDrive = require('../models/RecruitmentDrive');
// const RecruitmentQuestion = require('../models/RecruitmentQuestion');
// const Application = require('../models/Application');

// 1. Fix the authentication middleware (currently mocking)
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.substring(7);
    
    // TODO: Replace with your actual JWT verification
    // For now, decode or verify your actual JWT token
    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        
        // Temporary mock - replace with actual token verification
        req.user = { 
            id: 'your-actual-user-id', // Get from token
            role: 'club_head',
            clubId: 'your-actual-club-id' // Get from token or database
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Add club head authentication middleware
const authenticateClubHead = (req, res, next) => {
    if (req.user.role !== 'club_head' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Club head privileges required.' });
    }
    next();
};

// 2. Update Create Drive route to handle customQuestions
router.post('/recruitment-drives', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const {
                title,
                description,
                deadline,
                requirements,
                maxApplications,
                customQuestions, // Accept customQuestions from frontend
                isActive
            } = req.body;

            // Validation
            if (!title || !description || !deadline) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (new Date(deadline) <= new Date()) {
                return res.status(400).json({ message: 'Deadline must be in the future' });
            }

            const clubId = req.body.clubId || req.user.clubId;

            // Create recruitment drive
            const newDrive = new RecruitmentDrive({
                title,
                description,
                requirements: requirements || [],
                clubId,
                clubHeadId: req.user.id,
                deadline: new Date(deadline),
                maxApplications: maxApplications || 50,
                isActive: isActive !== false
            });

            const savedDrive = await newDrive.save();

            // Handle customQuestions (frontend format)
            if (customQuestions && customQuestions.length > 0) {
                const questionPromises = customQuestions.map((question, index) => {
                    const newQuestion = new RecruitmentQuestion({
                        recruitmentDriveId: savedDrive._id,
                        questionText: question.question,
                        questionType: question.type,
                        isRequired: question.required || false,
                        options: question.options || [],
                        orderIndex: index
                    });
                    return newQuestion.save();
                });

                await Promise.all(questionPromises);
            }

            res.status(201).json({ 
                message: 'Recruitment drive created successfully',
                drive: savedDrive
            });
        } catch (error) {
            console.error('Create drive error:', error);
            res.status(500).json({ message: 'Failed to create recruitment drive' });
        }
    }
);

// 3. Update Get Club Drives to return customQuestions format
router.get('/recruitment-drives/club/:clubId', 
    authenticateUser, 
    authenticateClubHead,
    async (req, res) => {
        try {
            const { clubId } = req.params;

            const drives = await RecruitmentDrive.find({ 
                clubId
            }).sort({ createdAt: -1 });

            const drivesWithDetails = await Promise.all(drives.map(async (drive) => {
                const questions = await RecruitmentQuestion.find({ 
                    recruitmentDriveId: drive._id 
                }).sort({ orderIndex: 1 });

                const applicationCount = await Application.countDocuments({ 
                    recruitmentDrive: drive._id 
                });

                // Format to match frontend expectations
                return {
                    _id: drive._id,
                    title: drive.title,
                    description: drive.description,
                    requirements: drive.requirements,
                    deadline: drive.deadline,
                    maxApplications: drive.maxApplications,
                    isActive: drive.isActive,
                    createdAt: drive.createdAt,
                    currentApplications: applicationCount,
                    // Format questions as customQuestions for frontend compatibility
                    customQuestions: questions.map(q => ({
                        id: q._id,
                        question: q.questionText,
                        type: q.questionType,
                        required: q.isRequired,
                        options: q.options
                    }))
                };
            }));

            res.json({ drives: drivesWithDetails });
        } catch (error) {
            console.error('Get club drives error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// 4. Update PUT route to handle customQuestions
router.put('/recruitment-drives/:driveId', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const { driveId } = req.params;
            const {
                title,
                description,
                deadline,
                requirements,
                maxApplications,
                customQuestions, // Accept customQuestions from frontend
                isActive
            } = req.body;

            // Verify user owns this drive
            const drive = await RecruitmentDrive.findOne({
                _id: driveId,
                clubHeadId: req.user.id
            });

            if (!drive) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Update drive
            await RecruitmentDrive.findByIdAndUpdate(driveId, {
                title,
                description,
                deadline: new Date(deadline),
                requirements: requirements || [],
                maxApplications,
                isActive,
                updatedAt: new Date()
            });

            // Update questions
            await RecruitmentQuestion.deleteMany({ recruitmentDriveId: driveId });

            if (customQuestions && customQuestions.length > 0) {
                const questionPromises = customQuestions.map((question, index) => {
                    const newQuestion = new RecruitmentQuestion({
                        recruitmentDriveId: driveId,
                        questionText: question.question,
                        questionType: question.type,
                        isRequired: question.required || false,
                        options: question.options || [],
                        orderIndex: index
                    });
                    return newQuestion.save();
                });

                await Promise.all(questionPromises);
            }

            res.json({ message: 'Drive updated successfully' });
        } catch (error) {
            console.error('Update drive error:', error);
            res.status(500).json({ message: 'Failed to update recruitment drive' });
        }
    }
);

// 5. Add toggle status route that frontend expects
router.patch('/recruitment-drives/:driveId/toggle-status', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const { driveId } = req.params;
            const { isActive } = req.body;

            // Verify user owns this drive
            const drive = await RecruitmentDrive.findOne({
                _id: driveId,
                clubHeadId: req.user.id
            });

            if (!drive) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Update status
            await RecruitmentDrive.findByIdAndUpdate(driveId, {
                isActive,
                updatedAt: new Date()
            });

            res.json({ 
                message: `Drive ${isActive ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            console.error('Toggle drive status error:', error);
            res.status(500).json({ message: 'Failed to toggle drive status' });
        }
    }
);

module.exports = router;