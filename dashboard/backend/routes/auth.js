const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        console.log('=== LOGIN REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            console.log('Missing credentials - email:', !!email, 'password:', !!password);
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        console.log('Looking for user with email:', email);
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('No user found with email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Comparing password...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    throw err;
                }
                console.log('Login successful for:', email);
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get authenticated user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Temporary route to create a test user - remove this in production
router.post('/create-test-user', async (req, res) => {
    try {
        const testEmail = 'admin@example.com';
        const testPassword = 'password123';
        
        // Check if user already exists
        let user = await User.findOne({ email: testEmail });
        if (user) {
            return res.json({ message: 'Test user already exists', email: testEmail });
        }
        
        user = new User({
            name: 'Test Admin',
            email: testEmail,
            password: testPassword,
            role: 'admin'
        });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(testPassword, salt);
        
        await user.save();
        res.json({ 
            message: 'Test user created successfully',
            email: testEmail,
            password: testPassword,
            role: 'admin'
        });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ error: error.message });
    }
});
// Add this temporary route - GET route so you can visit in browser
router.get('/create-demo-users', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    
    const demoUsers = [
      {
        name: 'System Admin',
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Drama Club Head',
        email: 'drama.head@college.edu',
        password: 'drama123',
        role: 'clubhead'
      },
      {
        name: 'Tech Club Head',
        email: 'tech.head@college.edu',
        password: 'tech123',
        role: 'clubhead'
      },
      {
        name: 'Student User',
        email: 'student@college.edu',
        password: 'student123',
        role: 'student'
      }
    ];

    const createdUsers = [];

    for (let userData of demoUsers) {
      // Check if user already exists
      let existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Create new user
        let user = new User(userData);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(userData.password, salt);
        await user.save();
        
        createdUsers.push({
          name: user.name,
          email: user.email,
          role: user.role,
          password: userData.password // Show original password for reference
        });
      }
    }

    if (createdUsers.length > 0) {
      res.json({ 
        message: `${createdUsers.length} demo users created successfully`,
        users: createdUsers
      });
    } else {
      res.json({ message: 'All demo users already exist' });
    }

  } catch (error) {
    console.error('Error creating demo users:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;