const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/pg');

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const usrName = req.body.username;
    const userLogin = await pool.query('SELECT * FROM admin WHERE username = $1', [usrName]);
    const user = userLogin.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User Not Found'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.admin_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.admin_id,
          username: user.username,
          status: user.status,
          role: user.role,
          name: user.name,
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router; 