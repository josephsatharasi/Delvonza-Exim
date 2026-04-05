const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const { createInquiry, getAllInquiries, updateInquiryStatus } = require('../controllers/inquiryController');

const router = express.Router();

router.post('/', createInquiry);
router.get('/admin/all', adminAuth, getAllInquiries);
router.patch('/admin/:id/status', adminAuth, updateInquiryStatus);

module.exports = router;
