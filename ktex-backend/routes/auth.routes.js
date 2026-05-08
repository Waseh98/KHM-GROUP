// ─── auth.routes.js ───────────────────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const { register, login, getMe, updateProfile, changePassword, logout, toggleWishlist } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',          register);
router.post('/login',             login);
router.post('/logout',            protect, logout);
router.get('/me',                 protect, getMe);
router.put('/update-profile',     protect, updateProfile);
router.put('/change-password',    protect, changePassword);
router.put('/wishlist/:productId',protect, toggleWishlist);

module.exports = router;
