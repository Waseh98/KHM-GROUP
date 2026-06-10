const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getCollections, getCollection, getCollectionBySlug, getCollectionProducts,
  createCollection, updateCollection, deleteCollection
} = require('../controllers/collection.controller');

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id/products', getCollectionProducts);
router.get('/:id', getCollection);
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

module.exports = router;
