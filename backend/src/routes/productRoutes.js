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

const router = express.Router();

router.get('/', getProducts);
router.put('/reorder', reorderProducts);
router.post('/', upload.array('images', 4), createProduct);
router.patch('/:id/hide-price', patchHidePrice);
router.put('/:id', upload.array('images', 4), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:slug', getProductBySlug);

module.exports = router;
