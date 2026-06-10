// ─── auth.routes.js ───────────────────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const { register, login, getMe, updateProfile, changePassword, logout, toggleWishlist, firebaseLogin, adminOauthLogin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',          register);
router.post('/login',             login);
router.post('/logout',            logout);
router.get('/me',                 protect, getMe);
router.put('/update-profile',     protect, updateProfile);
router.put('/change-password',    protect, changePassword);
router.put('/wishlist/:productId',protect, toggleWishlist);
router.post('/firebase-login', firebaseLogin);
router.post('/admin-oauth',       adminOauthLogin);

module.exports = router;
