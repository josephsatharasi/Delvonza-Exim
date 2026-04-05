const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const { getPublicSettings, updateSiteSettings } = require('../controllers/siteSettingsController');

const router = express.Router();

router.get('/public', getPublicSettings);
router.put('/', adminAuth, updateSiteSettings);

module.exports = router;
