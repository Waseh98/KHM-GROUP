const crypto = require('crypto');
const User = require('../models/User.model');
const { sendTokenResponse } = require('../middleware/auth.middleware');
const admin = require('firebase-admin');

async function verifyFirebaseIdToken(token) {
  if (!token) {
    return { error: { status: 401, message: 'Firebase ID token is required' } };
  }
  if (admin.apps.length === 0) {
    return { error: { status: 503, message: 'Firebase Admin is not configured on the server' } };
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = (decodedToken.email || '').toLowerCase().trim();
    if (!email) {
      return { error: { status: 400, message: 'Verified token did not include an email' } };
    }
    return {
      email,
      name: decodedToken.name || email.split('@')[0] || 'Member',
      emailVerified: Boolean(decodedToken.email_verified),
    };
  } catch (err) {
    return { error: { status: 401, message: 'Firebase token verification failed: ' + err.message } };
  }
}

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
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
    const email = (req.body.email || '').toLowerCase().trim();
    const { password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // 1) Check .env admin credentials — ensure a real DB user exists for JWT/protected routes
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (email === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          password === process.env.ADMIN_PASSWORD) {
        let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');
        if (!adminUser) {
          adminUser = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
          });
        } else if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          await adminUser.save();
        }
        return sendTokenResponse(adminUser, 200, res);
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

// @POST /api/auth/firebase-login — Customer Firebase → backend JWT
exports.firebaseLogin = async (req, res) => {
  try {
    const verified = await verifyFirebaseIdToken(req.body.token);
    if (verified.error) {
      return res.status(verified.error.status).json({ success: false, message: verified.error.message });
    }

    let user = await User.findOne({ email: verified.email });
    if (!user) {
      user = await User.create({
        name: verified.name,
        email: verified.email,
        password: crypto.randomBytes(32).toString('hex'),
        isEmailVerified: verified.emailVerified,
      });
    } else if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/admin-oauth
exports.adminOauthLogin = async (req, res) => {
  try {
    const verified = await verifyFirebaseIdToken(req.body.token);
    if (verified.error) {
      return res.status(verified.error.status).json({ success: false, message: verified.error.message });
    }

    const user = await User.findOne({ email: verified.email });
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
