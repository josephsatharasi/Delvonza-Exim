const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read'], default: 'new' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
