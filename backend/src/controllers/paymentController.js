const Stripe = require('stripe');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const getStripe = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }
  return new Stripe(secret);
};

const getFrontendBaseUrl = () => {
  const explicit = process.env.STRIPE_FRONTEND_URL || process.env.CLIENT_URL;
  if (explicit) {
    return String(explicit).trim().replace(/\/$/, '');
  }
  const first = (process.env.CLIENT_URLS || 'http://localhost:3000').split(',')[0];
  return first.trim().replace(/\/$/, '');
};

const getStripeCurrency = () => (process.env.STRIPE_CURRENCY || 'inr').toLowerCase();

const buildCheckoutPayload = (order, session) => ({
  url: session.url,
  mongoOrderId: String(order._id),
  sessionId: session.id
});

const createStripeSessionForOrder = async (order) => {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error(
      'Payment gateway is not configured. Add STRIPE_SECRET_KEY to backend .env.'
    );
    err.statusCode = 503;
    throw err;
  }
  if (order.status !== 'payment_pending') {
    const err = new Error('This order is not awaiting payment.');
    err.statusCode = 400;
    throw err;
  }
  const currency = getStripeCurrency();
  const unitAmount = Math.round(Number(order.total) * 100);
  const minCharge = currency === 'jpy' ? 50 : currency === 'inr' ? 100 : 50;
  if (unitAmount < minCharge) {
    const err = new Error('Order amount is too small for payment.');
    err.statusCode = 400;
    throw err;
  }

  const baseUrl = getFrontendBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: `Order ${String(order._id)}`,
            description: 'Delvonza Exim'
          }
        }
      }
    ],
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart?payment=cancelled`,
    client_reference_id: String(order._id),
    metadata: {
      mongoOrderId: String(order._id)
    }
  });

  order.stripeCheckoutSessionId = session.id;
  await order.save();
  return buildCheckoutPayload(order, session);
};

const createStripeCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required.' });
    }

    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const payload = await createStripeSessionForOrder(order);
    return res.json(payload);
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ message: error.message || 'Failed to create payment session.' });
  }
};

const verifyStripeSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ message: 'Payment gateway is not configured.' });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const mongoOrderId = session.metadata?.mongoOrderId || session.client_reference_id;
    if (!mongoOrderId) {
      return res.status(400).json({ message: 'Invalid checkout session.' });
    }

    const order = await Order.findOne({ _id: mongoOrderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.status === 'accepted' && order.paymentStatus === 'paid') {
      return res.json({ message: 'Order already confirmed.', order });
    }

    if (order.status !== 'payment_pending') {
      return res.status(400).json({ message: 'Order is not awaiting payment.' });
    }

    if (order.stripeCheckoutSessionId && order.stripeCheckoutSessionId !== session.id) {
      return res.status(400).json({ message: 'Payment does not match this order.' });
    }

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment has not completed yet.' });
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || '';

    // Use atomic updates to avoid Mongoose version/concurrency save errors.
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: mongoOrderId, user: req.userId },
      {
        $set: {
          status: 'accepted',
          paymentStatus: 'paid',
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId
        }
      },
      { new: true }
    );

    // Clear cart without loading/saving the document (prevents VersionError).
    await Cart.updateOne({ user: req.userId }, { $set: { items: [] } });

    return res.json({ message: 'Payment successful. Order confirmed.', order: updatedOrder || order });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment verification failed.' });
  }
};

module.exports = {
  createStripeCheckout,
  verifyStripeSession,
  createStripeSessionForOrder
};
