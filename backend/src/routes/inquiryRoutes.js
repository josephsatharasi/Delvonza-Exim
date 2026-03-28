const express = require('express');
const { createInquiry, getAllInquiries, updateInquiryStatus } = require('../controllers/inquiryController');

const router = express.Router();

router.post('/', createInquiry);
router.get('/admin/all', getAllInquiries);
router.patch('/admin/:id/status', updateInquiryStatus);

module.exports = router;
