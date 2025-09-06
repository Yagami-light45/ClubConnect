const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Club = require('../models/Club');
const Application = require('../models/Application');
const User = require('../models/User');

// Middleware to check if user is student
const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  next();
};

// Get all active clubs
router.get('/clubs', auth, studentAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ 
      isActive: true,
      recruitmentStatus: 'open' 
    }).populate('clubhead', 'name email');
    
    res.json(clubs);
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get club details
router.get('/clubs/:clubId', auth, studentAuth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId)
      .populate('clubhead', 'name email');
    
    if (!club || !club.isActive) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      club: req.params.clubId
    });
    
    res.json({
      ...club.toObject(),
      hasApplied: !!existingApplication,
      applicationStatus: existingApplication?.status
    });
  } catch (error) {
    console.error('Get club details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to a club
router.post('/clubs/:clubId/apply', auth, studentAuth, async (req, res) => {
  try {
    const { answers, additionalInfo } = req.body;
    
    // Check if club exists and is active
    const club = await Club.findById(req.params.clubId);
    if (!club || !club.isActive || club.recruitmentStatus !== 'open') {
      return res.status(400).json({ message: 'Club not available for applications' });
    }
    
    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      club: req.params.clubId
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this club' });
    }
    
    // Create new application
    const application = new Application({
      student: req.user.id,
      club: req.params.clubId,
      answers,
      additionalInfo,
      status: 'pending'
    });
    
    await application.save();
    
    res.json({ 
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Apply to club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's applications
router.get('/my-applications', auth, studentAuth, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('club', 'name description')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific application details
router.get('/applications/:applicationId', auth, studentAuth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      student: req.user.id
    }).populate('club', 'name description clubhead');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Get application details error:', error);
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

// Get dashboard stats
router.get('/dashboard', auth, studentAuth, async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments({ student: req.user.id });
    const pendingApplications = await Application.countDocuments({ 
      student: req.user.id, 
      status: 'pending' 
    });
    const acceptedApplications = await Application.countDocuments({ 
      student: req.user.id, 
      status: 'accepted' 
    });
    const rejectedApplications = await Application.countDocuments({ 
      student: req.user.id, 
      status: 'rejected' 
    });
    const availableClubs = await Club.countDocuments({ 
      isActive: true,
      recruitmentStatus: 'open'
    });
    
    res.json({
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      availableClubs
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw application (if still pending)
router.delete('/applications/:applicationId', auth, studentAuth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      student: req.user.id,
      status: 'pending'
    });
    
    if (!application) {
      return res.status(404).json({ 
        message: 'Application not found or cannot be withdrawn' 
      });
    }
    
    await Application.findByIdAndDelete(req.params.applicationId);
    
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search clubs
router.get('/clubs/search', auth, studentAuth, async (req, res) => {
  try {
    const { q, category } = req.query;
    
    let query = { 
      isActive: true,
      recruitmentStatus: 'open'
    };
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const clubs = await Club.find(query)
      .populate('clubhead', 'name email');
    
    res.json(clubs);
  } catch (error) {
    console.error('Search clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;