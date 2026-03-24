const Product = require('../models/Product');
const { uploadBufferToCloudinary } = require('../config/cloudinary');

const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      shortDescription = '',
      description = '',
      images = [],
      features = [],
      forms = [],
      origin = '',
      packaging = '',
      price
    } = req.body;

    const numericPrice = Number(price);
    if (!name || !slug || Number.isNaN(numericPrice)) {
      return res.status(400).json({ message: 'name, slug and numeric price are required.' });
    }

    const exists = await Product.findOne({ slug: slug.trim().toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: 'Product slug already exists.' });
    }

    let uploadedImages = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      uploadedImages = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file.buffer)));
    }

    const normalizedFeatures =
      typeof features === 'string'
        ? features
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(features)
          ? features
          : [];

    const normalizedForms =
      typeof forms === 'string'
        ? forms
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(forms)
          ? forms
          : [];

    const imageValues =
      uploadedImages.length > 0
        ? uploadedImages
        : Array.isArray(images) && images.length
          ? images
          : ['https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800'];

    const product = await Product.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      shortDescription: shortDescription || description || `${name} premium quality spice`,
      description: description || shortDescription || `${name} premium quality spice`,
      images: imageValues,
      features: normalizedFeatures,
      forms: normalizedForms.length ? normalizedForms : ['Whole'],
      origin: origin || '',
      packaging: packaging || '',
      price: numericPrice
    });

    return res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product.' });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

module.exports = { getProducts, createProduct, getProductBySlug };
