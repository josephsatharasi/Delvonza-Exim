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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const {
      name,
      slug,
      shortDescription,
      description,
      images,
      features,
      forms,
      origin,
      packaging,
      price
    } = req.body;

    const update = {};

    if (typeof name === 'string' && name.trim()) update.name = name.trim();
    if (typeof slug === 'string' && slug.trim()) update.slug = slug.trim().toLowerCase();
    if (typeof shortDescription === 'string') update.shortDescription = shortDescription;
    if (typeof description === 'string') update.description = description;
    if (typeof origin === 'string') update.origin = origin;
    if (typeof packaging === 'string') update.packaging = packaging;

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice)) {
        return res.status(400).json({ message: 'price must be numeric.' });
      }
      update.price = numericPrice;
    }

    const normalizedFeatures =
      typeof features === 'string'
        ? features
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(features)
          ? features
          : null;
    if (normalizedFeatures) update.features = normalizedFeatures;

    const normalizedForms =
      typeof forms === 'string'
        ? forms
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(forms)
          ? forms
          : null;
    if (normalizedForms) update.forms = normalizedForms;

    // Images: if new files are uploaded, replace images with Cloudinary URLs.
    // Otherwise, allow passing an images array; if omitted, keep existing.
    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer))
      );
      update.images = uploadedImages;
    } else if (Array.isArray(images) && images.length) {
      update.images = images;
    }

    if (update.slug && update.slug !== existing.slug) {
      const slugExists = await Product.findOne({ slug: update.slug });
      if (slugExists) {
        return res.status(409).json({ message: 'Product slug already exists.' });
      }
    }

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });
    return res.json({ message: 'Product updated successfully.', product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product.' });
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

module.exports = { getProducts, createProduct, getProductBySlug, updateProduct, deleteProduct };
