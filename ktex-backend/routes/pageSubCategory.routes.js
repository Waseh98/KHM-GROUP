const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getPageSubCategories, getPageSubCategory,
  createPageSubCategory, updatePageSubCategory, deletePageSubCategory
} = require('../controllers/pageSubCategory.controller');

router.get('/', getPageSubCategories);
router.get('/:id', getPageSubCategory);
router.post('/', protect, adminOnly, createPageSubCategory);
router.put('/:id', protect, adminOnly, updatePageSubCategory);
router.delete('/:id', protect, adminOnly, deletePageSubCategory);

module.exports = router;
