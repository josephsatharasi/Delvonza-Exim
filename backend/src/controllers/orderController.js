const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { createStripeSessionForOrder } = require('./paymentController');

const createOrderPayloadFromCart = async (req) => {
  const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
  if (!cart || !cart.items.length) {
    return { error: { status: 400, message: 'Cart is empty.' } };
  }

  await Order.updateMany(
    { user: req.userId, status: 'payment_pending' },
    { status: 'cancelled', paymentStatus: 'failed' }
  );

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0] || '',
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity
  }));
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, total, shippingAddress: req.body.shippingAddress || '' };
};

const createCheckoutSession = async (req, res) => {
  let order = null;
  try {
    const payload = await createOrderPayloadFromCart(req);
    if (payload.error) {
      return res.status(payload.error.status).json({ message: payload.error.message });
    }

    order = await Order.create({
      user: req.userId,
      status: 'payment_pending',
      paymentStatus: 'unpaid',
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      total: payload.total
    });

    const payment = await createStripeSessionForOrder(order);
    return res.status(201).json({
      message: 'Redirect to Stripe to complete payment.',
      order,
      payment
    });
  } catch (error) {
    if (order?._id) {
      await Order.findByIdAndDelete(order._id);
    }
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message:
        error.message ||
        'Could not start checkout. Order was not saved. Check Stripe keys and STRIPE_FRONTEND_URL / CLIENT_URLS.'
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const payload = await createOrderPayloadFromCart(req);
    if (payload.error) {
      return res.status(payload.error.status).json({ message: payload.error.message });
    }

    const order = await Order.create({
      user: req.userId,
      status: 'payment_pending',
      paymentStatus: 'unpaid',
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      total: payload.total
    });

    return res.status(201).json({
      message: 'Order created. Complete payment to confirm.',
      order
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order.' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch all orders.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const nextStatus = String(status).toLowerCase();
    const adminAllowedValues = ['accepted', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !adminAllowedValues.includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    if (order.status === 'payment_pending') {
      return res.status(400).json({
        message: 'Order is still awaiting customer payment. Cannot change status yet.'
      });
    }
    if (nextStatus === 'accepted') {
      return res.status(400).json({
        message: 'Accepted is set automatically after payment. Use processing / shipped / delivered.'
      });
    }
    const transitionsFromStatus = {
      accepted: ['processing', 'shipped', 'delivered', 'cancelled'],
      placed: ['processing', 'shipped', 'delivered', 'cancelled'],
      processing: ['shipped', 'delivered', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['cancelled'],
      cancelled: []
    };
    const allowedNextStatuses = transitionsFromStatus[order.status] || [];
    if (!allowedNextStatuses.includes(nextStatus)) {
      return res.status(400).json({
        message: `Cannot change status from "${order.status}" to "${nextStatus}".`
      });
    }
    order.status = nextStatus;
    await order.save();
    return res.json({ message: 'Order status updated.', order });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status.' });
  }
};

module.exports = {
  placeOrder,
  createCheckoutSession,
  getOrders,
  getAllOrders,
  updateOrderStatus
};
