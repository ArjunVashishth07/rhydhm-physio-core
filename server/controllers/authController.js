const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rhythm_clinic_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, mobile number, and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const user = new User({
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobile: mobile.trim(),
      password,
      role: role && ['patient', 'doctor', 'admin'].includes(role) ? role : 'patient'
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        phone: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or mobile number, and password'
      });
    }

    const identifier = email.trim();
    const isEmail = identifier.includes('@');

    // Query by email (case-insensitive) or by mobile
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { mobile: identifier }
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        phone: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Doctor Admin PIN Login (generates signed doctor JWT)
// @route   POST /api/auth/doctor-pin-login
exports.doctorPinLogin = async (req, res) => {
  try {
    const { passcode, pin } = req.body;
    const submittedPin = String(passcode || pin || '').trim();
    const validPin = process.env.ADMIN_PIN || '7777';

    if (!submittedPin) {
      return res.status(400).json({
        success: false,
        message: 'Passcode is required.'
      });
    }

    if (submittedPin !== validPin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid passcode. Access denied.'
      });
    }

    // Generate signed JWT with doctor role
    const token = jwt.sign(
      {
        userId: 'doctor_admin',
        role: 'doctor',
        fullName: 'Dr. Neha Sharma (PT)'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Doctor portal unlocked successfully.',
      token,
      user: {
        id: 'doctor_admin',
        fullName: 'Dr. Neha Sharma (PT)',
        role: 'doctor'
      }
    });
  } catch (error) {
    console.error('Doctor PIN login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during doctor authentication.'
    });
  }
};

