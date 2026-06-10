const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.get('/profile', protect, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = router;
