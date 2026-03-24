const Cart = require('../models/Cart');
const Product = require('../models/Product');

const formatCart = (cart) => ({
  id: cart._id,
  user: cart.user,
  items: cart.items.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.images?.[0] || '',
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity
  }))
});

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product');
  }
  return cart;
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    return res.json({ cart: formatCart(cart) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch cart.' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }
    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (item) {
      item.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }
    await cart.save();
    const hydratedCart = await Cart.findById(cart._id).populate('items.product');
    return res.json({ message: 'Added to cart.', cart: formatCart(hydratedCart) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add to cart.' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'productId and numeric quantity are required.' });
    }
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }
    if (quantity <= 0) {
      cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
    } else {
      cart.items = cart.items.map((entry) =>
        entry.product.toString() === productId ? { ...entry.toObject(), quantity } : entry
      );
    }
    await cart.save();
    const hydratedCart = await Cart.findById(cart._id).populate('items.product');
    return res.json({ message: 'Cart updated.', cart: formatCart(hydratedCart) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update cart.' });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }
    cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
    await cart.save();
    const hydratedCart = await Cart.findById(cart._id).populate('items.product');
    return res.json({ message: 'Item removed.', cart: formatCart(hydratedCart) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove cart item.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
