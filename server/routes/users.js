const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile - Protected route
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .lean();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user balance - Protected route
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('balance')
      .lean();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
