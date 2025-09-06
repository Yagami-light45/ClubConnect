const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import existing models
const Application = require('../models/Application'); // Your existing model

// Define new models that don't conflict
const recruitmentDriveSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String], // Array of requirements as per your frontend
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    clubHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date, required: true }, // Using deadline instead of startDate/endDate
    maxApplications: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const recruitmentQuestionSchema = new mongoose.Schema({
    recruitmentDriveId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruitmentDrive', required: true },
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['text', 'textarea', 'multiple-choice', 'single-choice'], required: true },
    isRequired: { type: Boolean, default: false },
    options: [String],
    orderIndex: { type: Number, required: true }
});

// Create models (check if they already exist to avoid overwrite error)
const RecruitmentDrive = mongoose.models.RecruitmentDrive || mongoose.model('RecruitmentDrive', recruitmentDriveSchema);
const RecruitmentQuestion = mongoose.models.RecruitmentQuestion || mongoose.model('RecruitmentQuestion', recruitmentQuestionSchema);

// Simple auth middleware (replace with your actual auth)
const authenticateUser = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // TODO: Replace with actual JWT verification
    // For now, mock user (replace with your auth logic)
    req.user = { 
        id: new mongoose.Types.ObjectId(), 
        role: 'club_head',
        clubId: new mongoose.Types.ObjectId() // Mock club ID
    };
    next();
};

const authenticateClubHead = (req, res, next) => {
    if (req.user.role !== 'club_head' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Club head role required.' });
    }
    next();
};

// ===== ROUTES =====

// Test route
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Recruitment routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Create new recruitment drive
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
                questions
            } = req.body;

            // Validation
            if (!title || !description || !deadline) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (new Date(deadline) <= new Date()) {
                return res.status(400).json({ message: 'Deadline must be in the future' });
            }

            // Use clubId from request body or user context
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
                isActive: true
            });

            const savedDrive = await newDrive.save();

            // Create questions if provided
            if (questions && questions.length > 0) {
                const questionPromises = questions.map((question, index) => {
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

// Get all recruitment drives for a club
router.get('/recruitment-drives/club/:clubId', 
    authenticateUser, 
    authenticateClubHead,
    async (req, res) => {
        try {
            const { clubId } = req.params;

            // Get drives for the club
            const drives = await RecruitmentDrive.find({ 
                clubId
            }).sort({ createdAt: -1 });

            // Get questions for each drive and application count
            const drivesWithDetails = await Promise.all(drives.map(async (drive) => {
                const questions = await RecruitmentQuestion.find({ 
                    recruitmentDriveId: drive._id 
                }).sort({ orderIndex: 1 });

                const applicationCount = await Application.countDocuments({ 
                    recruitmentDrive: drive._id 
                });

                return {
                    ...drive.toObject(),
                    id: drive._id, // Add id field for frontend compatibility
                    questions,
                    currentApplications: applicationCount
                };
            }));

            res.json({ drives: drivesWithDetails });
        } catch (error) {
            console.error('Get club drives error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Get all active recruitment drives (for students)
router.get('/recruitment-drives/active', 
    authenticateUser,
    async (req, res) => {
        try {
            const currentDate = new Date();
            
            const drives = await RecruitmentDrive.find({
                isActive: true,
                deadline: { $gte: currentDate }
            })
            .populate('clubId', 'name category description')
            .sort({ createdAt: -1 });

            // Get application counts
            const drivesWithCounts = await Promise.all(drives.map(async (drive) => {
                const applicationCount = await Application.countDocuments({
                    recruitmentDrive: drive._id
                });

                return {
                    ...drive.toObject(),
                    id: drive._id,
                    currentApplications: applicationCount
                };
            }));

            res.json({ drives: drivesWithCounts });
        } catch (error) {
            console.error('Get active drives error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Get specific recruitment drive details with questions
router.get('/recruitment-drives/:driveId/details', 
    authenticateUser,
    async (req, res) => {
        try {
            const { driveId } = req.params;

            const drive = await RecruitmentDrive.findOne({
                _id: driveId,
                isActive: true,
                deadline: { $gte: new Date() }
            }).populate('clubId', 'name category description');

            if (!drive) {
                return res.status(404).json({ message: 'Drive not found or not active' });
            }

            // Get questions
            const questions = await RecruitmentQuestion.find({
                recruitmentDriveId: driveId
            }).sort({ orderIndex: 1 });

            const driveWithQuestions = {
                ...drive.toObject(),
                id: drive._id,
                questions: questions.map(q => ({
                    ...q.toObject(),
                    id: q._id
                }))
            };

            res.json({ drive: driveWithQuestions });
        } catch (error) {
            console.error('Get drive details error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Submit application (using your existing Application model)
router.post('/applications', 
    authenticateUser,
    async (req, res) => {
        try {
            const { recruitmentDriveId, answers, additionalInfo } = req.body;

            // Verify drive exists and is active
            const drive = await RecruitmentDrive.findOne({
                _id: recruitmentDriveId,
                isActive: true,
                deadline: { $gte: new Date() }
            });

            if (!drive) {
                return res.status(400).json({ message: 'Drive not found or not active' });
            }

            // Check if user already applied
            const existingApplication = await Application.findOne({
                recruitmentDrive: recruitmentDriveId,
                student: req.user.id
            });

            if (existingApplication) {
                return res.status(400).json({ message: 'You have already applied to this drive' });
            }

            // Check application limit
            const currentApplications = await Application.countDocuments({
                recruitmentDrive: recruitmentDriveId
            });

            if (currentApplications >= drive.maxApplications) {
                return res.status(400).json({ message: 'Application limit reached' });
            }

            // Create application using your existing model structure
            const newApplication = new Application({
                student: req.user.id,
                club: drive.clubId,
                recruitmentDrive: recruitmentDriveId,
                answers: answers || new Map(),
                additionalInfo: additionalInfo || '',
                status: 'pending'
            });

            const savedApplication = await newApplication.save();

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: savedApplication._id
            });
        } catch (error) {
            console.error('Submit application error:', error);
            res.status(500).json({ message: 'Failed to submit application' });
        }
    }
);

// Update recruitment drive
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
                questions
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
                updatedAt: new Date()
            });

            // Update questions - delete existing and create new ones
            await RecruitmentQuestion.deleteMany({ recruitmentDriveId: driveId });

            if (questions && questions.length > 0) {
                const questionPromises = questions.map((question, index) => {
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

// Delete recruitment drive
router.delete('/recruitment-drives/:driveId', 
    authenticateUser,
    authenticateClubHead,
    async (req, res) => {
        try {
            const { driveId } = req.params;

            // Verify user owns this drive
            const drive = await RecruitmentDrive.findOne({
                _id: driveId,
                clubHeadId: req.user.id
            });

            if (!drive) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Check if there are applications
            const applicationCount = await Application.countDocuments({
                recruitmentDrive: driveId
            });

            if (applicationCount > 0) {
                return res.status(400).json({ 
                    message: 'Cannot delete drive with existing applications' 
                });
            }

            // Delete questions first
            await RecruitmentQuestion.deleteMany({ recruitmentDriveId: driveId });
            
            // Delete drive
            await RecruitmentDrive.findByIdAndDelete(driveId);

            res.json({ message: 'Drive deleted successfully' });
        } catch (error) {
            console.error('Delete drive error:', error);
            res.status(500).json({ message: 'Failed to delete recruitment drive' });
        }
    }
);

module.exports = router;