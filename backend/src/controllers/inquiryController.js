const Inquiry = require('../models/Inquiry');
const { emitNewInquiry } = require('../socket');

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone = '', country = '', message, productSlug = '', productName = '' } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    if (!String(phone).trim()) {
      return res.status(400).json({ message: 'Phone is required.' });
    }
    const slug = String(productSlug || '').trim().slice(0, 200);
    const pname = String(productName || '').trim().slice(0, 300);
    const inquiry = await Inquiry.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      country: String(country).trim(),
      message: String(message).trim(),
      productSlug: slug,
      productName: pname
    });
    emitNewInquiry(inquiry);
    return res.status(201).json({ message: 'Thank you. We will get back to you soon.', inquiry });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit inquiry.' });
  }
};

const getAllInquiries = async (_req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({ inquiries });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const next = String(status || '').toLowerCase();
    if (!['new', 'read'].includes(next)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(id, { $set: { status: next } }, { new: true });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    return res.json({ message: 'Inquiry updated.', inquiry });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update inquiry.' });
  }
};

module.exports = { createInquiry, getAllInquiries, updateInquiryStatus };
