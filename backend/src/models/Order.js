const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'payment_pending' },
    paymentStatus: { type: String, default: 'unpaid' },
    paymentMethod: { type: String, default: 'online' },
    stripeCheckoutSessionId: { type: String, default: '' },
    stripePaymentIntentId: { type: String, default: '' },
    shippingAddress: { type: String, default: '' },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
