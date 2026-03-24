require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Black Pepper',
    slug: 'black-pepper',
    shortDescription: 'Premium quality black pepper with rich aroma and bold flavor',
    description: 'Sourced from India with export-grade quality and strong aroma.',
    images: ['https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['100% Pure', 'Rich Aroma', 'Bold Flavor', 'Export Quality'],
    forms: ['Whole', 'Cracked', 'Ground Powder'],
    origin: 'Kerala, India',
    packaging: 'Available in 25kg, 50kg bags or customized packaging',
    price: 450
  },
  {
    name: 'Turmeric',
    slug: 'turmeric',
    shortDescription: 'Golden turmeric powder with high curcumin content',
    description: 'Premium turmeric selected for bright color and quality.',
    images: ['https://images.pexels.com/photos/531446/pexels-photo-531446.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['High Curcumin', 'Bright Color', 'Pure & Natural', 'Premium Grade'],
    forms: ['Whole Fingers', 'Ground Powder'],
    origin: 'Tamil Nadu, India',
    packaging: 'Available in 25kg, 50kg bags or customized packaging',
    price: 300
  },
  {
    name: 'Cardamom',
    slug: 'cardamom',
    shortDescription: 'Aromatic green cardamom pods with intense flavor',
    description: 'Hand-picked premium green cardamom with strong aroma.',
    images: ['https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['Intense Aroma', 'Premium Quality', 'Hand-Picked', 'Export Grade'],
    forms: ['Whole Pods', 'Seeds', 'Ground Powder'],
    origin: 'Kerala, India',
    packaging: 'Available in 10kg, 25kg bags or customized packaging',
    price: 700
  },
  {
    name: 'Dried Red Chillies',
    slug: 'dried-red-chillies',
    shortDescription: 'Fiery red chillies with perfect heat and color',
    description: 'Vibrant red chilli with excellent heat and export quality.',
    images: ['https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['Vibrant Color', 'Perfect Heat', 'Rich Flavor', 'Premium Quality'],
    forms: ['Whole Dried', 'Crushed', 'Ground Powder'],
    origin: 'Andhra Pradesh, India',
    packaging: 'Available in 25kg, 50kg bags or customized packaging',
    price: 260
  },
  {
    name: 'Cinnamon',
    slug: 'cinnamon',
    shortDescription: 'Premium Ceylon cinnamon with sweet aroma',
    description: 'High quality cinnamon with warm sweet flavor profile.',
    images: ['https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['Sweet Aroma', 'Premium Grade', 'Natural', 'Export Quality'],
    forms: ['Whole Sticks', 'Broken', 'Ground Powder'],
    origin: 'Kerala, India',
    packaging: 'Available in 20kg, 25kg bags or customized packaging',
    price: 520
  },
  {
    name: 'Cloves',
    slug: 'cloves',
    shortDescription: 'Aromatic whole cloves with intense flavor',
    description: 'Carefully processed cloves that retain natural oils.',
    images: ['https://images.pexels.com/photos/4198948/pexels-photo-4198948.jpeg?auto=compress&cs=tinysrgb&w=800'],
    features: ['Strong Aroma', 'Premium Quality', 'Hand-Picked', 'Natural'],
    forms: ['Whole Cloves', 'Ground Powder'],
    origin: 'Tamil Nadu, India',
    packaging: 'Available in 25kg, 50kg bags or customized packaging',
    price: 650
  }
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    // eslint-disable-next-line no-console
    console.log('Products seeded successfully');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
