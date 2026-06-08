const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendTokenResponse } = require('../middleware/auth.middleware');
const admin = require('firebase-admin');

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, phone });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // 1) Check .env admin credentials first (works even without DB user)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { email: process.env.ADMIN_EMAIL, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: { email: process.env.ADMIN_EMAIL, role: 'admin', name: 'Admin' }
        });
      }
    }

    // 2) Check MongoDB users
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/logout
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @POST /api/auth/admin-oauth
exports.adminOauthLogin = async (req, res) => {
  try {
    const { email, token } = req.body;
    let targetEmail = email;

    // Secure verification of Firebase ID token if provided
    if (token) {
      if (admin.apps.length > 0) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          targetEmail = decodedToken.email;
        } catch (err) {
          return res.status(401).json({ success: false, message: 'Firebase token verification failed: ' + err.message });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Firebase token provided but backend is not configured with Firebase Admin credentials' });
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'Email or token is required' });
    }

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'This account is not an admin' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/auth/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
