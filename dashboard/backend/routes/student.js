const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming you have this middleware
const User = require('../models/User');
const Club = require('../models/Club');
const Application = require('../models/Application');
const RecruitmentDrive = require('../models/RecruitmentDrive'); // This import is necessary

// Middleware to check if user is student
const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  next();
};

// --- ROUTES THAT MATCH YOUR FRONTEND ---

/**
 * ROUTE 1 (FIXED): GET /api/recruitment-drives/active
 * This is the new route your frontend needs to fetch active drives.
 */
router.get('/recruitment-drives/active', auth, studentAuth, async (req, res) => {
  try {
    // Find all drives that are active and populate the club info
    const drives = await RecruitmentDrive.find({ isActive: true })
      .populate('clubId', 'name description category') // Get club name/desc
      .sort({ deadline: 1 });

    // We also need to get question details for each drive
    const drivesWithDetails = await Promise.all(
      drives.map(async (drive) => {
        // Find questions linked to this drive
        const questions = await RecruitmentQuestion.find({ recruitmentDriveId: drive._id }).sort({ orderIndex: 1 });
        
        // Count current applications to see if it's full
        const appCount = await Application.countDocuments({ driveId: drive._id });

        return {
          ...drive.toObject(),
          customQuestions: questions.map(q => ({ // Format questions for the frontend
            id: q._id,
            question: q.questionText,
            type: q.questionType,
            required: q.isRequired,
          })),
          currentApplications: appCount
        };
      })
    );

    res.json({ drives: drivesWithDetails });

  } catch (error) {
    console.error('Error fetching active drives:', error);
    res.status(500).json({ message: 'Server error fetching drives' });
  }
});


/**
 * ROUTE 2 (FIXED): POST /api/applications
 * This replaces the old "/clubs/:clubId/apply" route.
 * This route accepts an application for a DRIVE, just like your frontend expects.
 */
router.post('/applications', auth, studentAuth, async (req, res) => {
  try {
    const { driveId, responses } = req.body;
    const studentId = req.user.id;

    // --- Validation ---
    // 1. Check if drive exists and is active
    const drive = await RecruitmentDrive.findById(driveId);
    if (!drive || !drive.isActive) {
      return res.status(400).json({ message: 'This recruitment drive is not active.' });
    }

    // 2. Check if deadline has passed
    if (new Date(drive.deadline) < new Date()) {
      return res.status(400).json({ message: 'The deadline for this drive has passed.' });
    }

    // 3. Check if student already applied to this drive
    const existingApplication = await Application.findOne({
      studentId: studentId,
      driveId: driveId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this recruitment drive.' });
    }

    // 4. Check if drive is full
    const appCount = await Application.countDocuments({ driveId: driveId });
    if (appCount >= drive.maxApplications) {
      return res.status(400).json({ message: 'This drive is no longer accepting applications (limit reached).' });
    }
    // --- End Validation ---

    // Create new application based on the "Drive" system
    const application = new Application({
      studentId: studentId,
      driveId: driveId,
      clubId: drive.clubId, // Store the parent club ID
      responses: responses,  // Save the key-value object of {question: answer}
      status: 'pending'
    });

    await application.save();

    res.status(201).json({ 
      message: 'Application submitted successfully!',
      application
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});


/**
 * ROUTE 3 (FIXED): GET /api/my-applications
 * This path matches my previous recommendation. Change your frontend to call this.
 * The logic is updated to populate the Drive and Club info.
 */
router.get('/my-applications', auth, studentAuth, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
         path: 'driveId',
         select: 'title deadline',
         populate: {
            path: 'clubId',
            select: 'name' // Get the name of the club from the drive
         }
      })
      .sort({ createdAt: -1 });
      
    res.json(applications);

  } catch (error) {
    console.error('Get my-applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ROUTE 4 (KEPT): GET /api/clubs
 * Your frontend also calls this. This logic is fine as-is.
 * This provides a list of all clubs, separate from the drives.
 */
router.get('/clubs', auth, studentAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ 
      status: 'approved', // Or whatever your "active" logic is
    }).populate('clubhead', 'name');
    
    res.json({ clubs: clubs });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * ROUTE 5 & 6 (KEPT): /api/profile
 * These routes were correct. Your frontend should call these paths.
 */

// Get student profile
router.get('/profile', auth, studentAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', auth, studentAuth, async (req, res) => {
  try {
    const { name, phone, year, branch, skills, interests, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, year, branch, skills, interests, bio },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;