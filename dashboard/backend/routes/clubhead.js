const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Club = require('../models/Club');
const Application = require('../models/Application');
const User = require('../models/User');

// Middleware to check if user is clubhead
const clubheadAuth = (req, res, next) => {
  if (req.user.role !== 'clubhead') {
    return res.status(403).json({ message: 'Access denied. Clubhead only.' });
  }
  next();
};

// Get clubhead's club(s)
router.get('/my-clubs', auth, clubheadAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ clubhead: req.user.id });
    res.json(clubs);
  } catch (error) {
    console.error('Get my clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats for clubhead
router.get('/dashboard', auth, clubheadAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ clubhead: req.user.id });
    const clubIds = clubs.map(club => club._id);
    
    const totalApplications = await Application.countDocuments({ 
      club: { $in: clubIds } 
    });
    const pendingApplications = await Application.countDocuments({ 
      club: { $in: clubIds }, 
      status: 'pending' 
    });
    const acceptedApplications = await Application.countDocuments({ 
      club: { $in: clubIds }, 
      status: 'accepted' 
    });
    const rejectedApplications = await Application.countDocuments({ 
      club: { $in: clubIds }, 
      status: 'rejected' 
    });

    res.json({
      totalClubs: clubs.length,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications
    });
  } catch (error) {
    console.error('Clubhead dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for clubhead's clubs
router.get('/applications', auth, clubheadAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ clubhead: req.user.id });
    const clubIds = clubs.map(club => club._id);
    
    const applications = await Application.find({ 
      club: { $in: clubIds } 
    })
    .populate('student', 'name email phone year branch')
    .populate('club', 'name')
    .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific club
router.get('/clubs/:clubId/applications', auth, clubheadAuth, async (req, res) => {
  try {
    // Verify the club belongs to this clubhead
    const club = await Club.findOne({ 
      _id: req.params.clubId, 
      clubhead: req.user.id 
    });
    
    if (!club) {
      return res.status(403).json({ message: 'Access denied to this club' });
    }
    
    const applications = await Application.find({ club: req.params.clubId })
      .populate('student', 'name email phone year branch')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get club applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (accept/reject)
router.put('/applications/:applicationId', auth, clubheadAuth, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const application = await Application.findById(req.params.applicationId)
      .populate('club');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Verify the club belongs to this clubhead
    if (application.club.clubhead.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this application' });
    }
    
    application.status = status;
    application.feedback = feedback;
    application.reviewedAt = new Date();
    
    await application.save();
    
    // Populate the response
    await application.populate('student', 'name email phone year branch');
    
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update club information
router.put('/clubs/:clubId', auth, clubheadAuth, async (req, res) => {
  try {
    const { description, recruitmentStatus, requirements, maxMembers } = req.body;
    
    const club = await Club.findOne({ 
      _id: req.params.clubId, 
      clubhead: req.user.id 
    });
    
    if (!club) {
      return res.status(403).json({ message: 'Access denied to this club' });
    }
    
    const updatedClub = await Club.findByIdAndUpdate(
      req.params.clubId,
      { description, recruitmentStatus, requirements, maxMembers },
      { new: true }
    );
    
    res.json(updatedClub);
  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get club members (accepted applications)
router.get('/clubs/:clubId/members', auth, clubheadAuth, async (req, res) => {
  try {
    // Verify the club belongs to this clubhead
    const club = await Club.findOne({ 
      _id: req.params.clubId, 
      clubhead: req.user.id 
    });
    
    if (!club) {
      return res.status(403).json({ message: 'Access denied to this club' });
    }
    
    const members = await Application.find({ 
      club: req.params.clubId,
      status: 'accepted'
    }).populate('student', 'name email phone year branch');
    
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk update application status
router.put('/applications/bulk-update', auth, clubheadAuth, async (req, res) => {
  try {
    const { applicationIds, status, feedback } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Verify all applications belong to this clubhead's clubs
    const applications = await Application.find({ 
      _id: { $in: applicationIds } 
    }).populate('club');
    
    const unauthorizedApps = applications.filter(
      app => app.club.clubhead.toString() !== req.user.id
    );
    
    if (unauthorizedApps.length > 0) {
      return res.status(403).json({ message: 'Access denied to some applications' });
    }
    
    await Application.updateMany(
      { _id: { $in: applicationIds } },
      { 
        status, 
        feedback, 
        reviewedAt: new Date() 
      }
    );
    
    res.json({ message: `${applicationIds.length} applications updated successfully` });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;