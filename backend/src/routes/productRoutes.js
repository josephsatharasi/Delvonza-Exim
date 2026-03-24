const express = require('express');
const { getProducts, createProduct, getProductBySlug } = require('../controllers/productController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.post('/', upload.array('images', 4), createProduct);
router.get('/:slug', getProductBySlug);

module.exports = router;
