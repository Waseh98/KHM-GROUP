const express = require('express');
const router  = express.Router();
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/',            getAllProducts);
router.get('/featured',    getFeaturedProducts);
router.get('/:id',         getProduct);
router.post('/',           protect, adminOnly, createProduct);
router.put('/:id',         protect, adminOnly, updateProduct);
router.delete('/:id',      protect, adminOnly, deleteProduct);

module.exports = router;
