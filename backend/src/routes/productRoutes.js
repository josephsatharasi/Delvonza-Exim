const express = require('express');
const {
  getProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  patchHidePrice,
  deleteProduct,
  reorderProducts
} = require('../controllers/productController');
const upload = require('../middleware/upload');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', getProducts);
router.put('/reorder', adminAuth, reorderProducts);
router.post('/', adminAuth, upload.array('images', 4), createProduct);
router.patch('/:id/hide-price', adminAuth, patchHidePrice);
router.put('/:id', adminAuth, upload.array('images', 4), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.get('/:slug', getProductBySlug);

module.exports = router;
