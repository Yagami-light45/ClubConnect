const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Club = require('../models/Club');
const Application = require('../models/Application');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Get admin dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClubs = await Club.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalClubs,
      totalApplications,
      pendingApplications
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/users', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password, role });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    res.json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all clubs
router.get('/clubs', auth, adminAuth, async (req, res) => {
  try {
    const clubs = await Club.find().populate('clubhead', 'name email');
    res.json(clubs);
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new club
router.post('/clubs', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, clubhead, category, maxMembers } = req.body;
    
    const club = new Club({
      name,
      description,
      clubhead,
      category,
      maxMembers,
      isActive: true
    });
    
    await club.save();
    res.json({ message: 'Club created successfully', clubId: club.id });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update club
router.put('/clubs/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, clubhead, category, maxMembers, isActive } = req.body;
    
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { name, description, clubhead, category, maxMembers, isActive },
      { new: true }
    ).populate('clubhead', 'name email');
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    res.json(club);
  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete club
router.delete('/clubs/:id', auth, adminAuth, async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Delete club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications
router.get('/applications', auth, adminAuth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('club', 'name')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;