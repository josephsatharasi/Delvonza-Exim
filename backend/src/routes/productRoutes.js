const express = require('express');
const {
  getProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.post('/', upload.array('images', 4), createProduct);
router.put('/:id', upload.array('images', 4), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:slug', getProductBySlug);

module.exports = router;
