const express = require('express');
const { getPublicSettings, updateSiteSettings } = require('../controllers/siteSettingsController');

const router = express.Router();

router.get('/public', getPublicSettings);
router.put('/', updateSiteSettings);

module.exports = router;
