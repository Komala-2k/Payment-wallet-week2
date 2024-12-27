const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Test endpoint to list all users (for debugging)
router.get('/users/list', async (req, res) => {
  try {
    const users = await User.find({}, 'name email upiId balance');
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Error listing users' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    let existingUser = await User.findOne({
      $or: [
        { email },
        { phoneNumber }
      ].filter(Boolean)
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email) message = 'Email already registered';
      if (existingUser.phoneNumber === phoneNumber) message = 'Phone number already registered';
      return res.status(400).json({ message });
    }

    // Generate username from email
    let username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Add random numbers if username is too short
    if (username.length < 3) {
      username += Math.random().toString().substring(2, 5);
    }
    
    // Truncate if too long
    if (username.length > 30) {
      username = username.substring(0, 30);
    }

    // Generate unique UPI ID
    const upiId = `${username}.${uuidv4().substring(0, 6)}@digitalwallet`;

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      username,
      upiId,
      balance: 0
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        upiId: user.upiId,
        phoneNumber: user.phoneNumber,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        upiId: user.upiId,
        phoneNumber: user.phoneNumber,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    res.json({ available: !existingUser });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ message: 'Server error checking username' });
  }
});

// Test route to verify server is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

module.exports = router;
