const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    socialVisibility: {
      facebook: { type: Boolean, default: true },
      instagram: { type: Boolean, default: true },
      linkedin: { type: Boolean, default: true },
      youtube: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
