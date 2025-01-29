const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const user = require('../models/user');

// Register
router.post('/register', async (req, res, next) => {
  const { name, email, username, password } = req.body;

  // Create new user instance
  const newUser = new User({
    name,
    email,
    username,
    password
  });

  try {
    // Add user using the async addUser method (assuming it returns a promise)
    const savedUser = await User.addUser(newUser);
    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      user: savedUser
    });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({
      success: false,
      msg: 'Failed to register user',
      error: err.message
    });
  }
});

// POST /authenticate
router.post('/authenticate', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Find user by username
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Compare passwords
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Incorrect password' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.secret,
      { expiresIn: '7d' } // 1 week
    );

    res.status(200).json({
      success: true,
      token: 'Bearer ' + token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

// Profile


router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, msg: 'Unauthorized' });
      }
      res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
  }
);

// Validate



module.exports = router;