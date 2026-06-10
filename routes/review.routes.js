const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createReview, getProductReviews, updateReview, deleteReview, markHelpful } = require('../controllers/review.controller');

router.post('/:productId',      createReview);
router.get('/:productId',       getProductReviews);
router.put('/:id',              protect, updateReview);
router.delete('/:id',           protect, deleteReview);
router.put('/:id/helpful',      protect, markHelpful);

module.exports = router;
