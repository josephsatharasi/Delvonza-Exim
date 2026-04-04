const SiteSettings = require('../models/SiteSettings');

const DEFAULT_SOCIAL = {
  facebook: true,
  instagram: true,
  linkedin: true,
  youtube: true,
  whatsapp: true
};

const getOrCreateSettings = async () => {
  let doc = await SiteSettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await SiteSettings.create({ key: 'default', socialVisibility: DEFAULT_SOCIAL });
  }
  return doc;
};

const mergeSocial = (sub) => {
  const v = sub && typeof sub === 'object' ? sub : {};
  const out = { ...DEFAULT_SOCIAL };
  Object.keys(DEFAULT_SOCIAL).forEach((k) => {
    if (v[k] === false) out[k] = false;
  });
  return out;
};

const getPublicSettings = async (_req, res) => {
  try {
    const doc = await getOrCreateSettings();
    return res.json({ socialVisibility: mergeSocial(doc.socialVisibility) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load settings.' });
  }
};

const updateSiteSettings = async (req, res) => {
  try {
    const { socialVisibility } = req.body;
    if (!socialVisibility || typeof socialVisibility !== 'object') {
      return res.status(400).json({ message: 'socialVisibility object is required.' });
    }
    const next = { ...DEFAULT_SOCIAL };
    ['facebook', 'instagram', 'linkedin', 'youtube', 'whatsapp'].forEach((k) => {
      if (socialVisibility[k] !== undefined) {
        next[k] = socialVisibility[k] === true || socialVisibility[k] === 'true';
      }
    });
    const doc = await SiteSettings.findOneAndUpdate(
      { key: 'default' },
      { $set: { socialVisibility: next }, $setOnInsert: { key: 'default' } },
      { new: true, upsert: true }
    );
    return res.json({
      message: 'Settings saved.',
      socialVisibility: mergeSocial(doc.socialVisibility)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save settings.' });
  }
};

module.exports = { getPublicSettings, updateSiteSettings };
