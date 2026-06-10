const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getCategories, getCategory, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
  getSubCategoryAnalytics, seedDefaultCategories
} = require('../controllers/category.controller');

router.get('/',                                  getCategories);
router.get('/analytics',                         getSubCategoryAnalytics);
router.get('/seed',                               seedDefaultCategories);
router.get('/slug/:slug',                        getCategoryBySlug);
router.get('/:id',                               getCategory);
router.post('/',            protect, adminOnly,  createCategory);
router.put('/:id',          protect, adminOnly,  updateCategory);
router.delete('/:id',       protect, adminOnly,  deleteCategory);

module.exports = router;
