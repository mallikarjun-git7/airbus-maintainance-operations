const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getOne, runQuery } = require('../db/database');
const { validateRegistration, validateLogin } = require('../utils/validators');

const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    const validation = validateRegistration({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      });
    }

    // Check if user already exists
    const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await runQuery(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), passwordHash]
    );
    
    const userId = result.lastID;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user data
    const user = await getOne('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        access_token: token,
        token_type: 'bearer'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      });
    }

    // Find user by email
    const user = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    
    // EXACT error message as required: "Account not exist"
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not exist'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    // EXACT error message as required: "Invalid Password"
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          is_active: true,
          created_at: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
}

/**
 * Get current user (protected route)
 */
async function getCurrentUser(req, res) {
  try {
    // req.user is set by auth middleware
    const user = await getOne('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
}

/**
 * Forgot password (basic implementation)
 * In production, this would send an email with a reset token
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await getOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);

    // Don't reveal whether email exists for security
    // Always return success message
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

    // TODO: In production:
    // 1. Generate reset token
    // 2. Store token in database with expiration
    // 3. Send email with reset link
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
}

/**
 * Logout (client-side token deletion is sufficient)
 * This endpoint is optional
 */
function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  logout
};
