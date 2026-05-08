const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getDashboardStats, getAllUsers, updateUserRole, deleteUser, getAllReviews, approveReview } = require('../controllers/admin.controller');

router.use(protect, adminOnly);

router.get('/dashboard',             getDashboardStats);
router.get('/users',                 getAllUsers);
router.put('/users/:id',             updateUserRole);
router.delete('/users/:id',          deleteUser);
router.get('/reviews',               getAllReviews);
router.put('/reviews/:id/approve',   approveReview);

module.exports = router;
