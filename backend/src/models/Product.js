const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    // No artificial max length; full text stored (MongoDB document size limits apply).
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    forms: { type: [String], default: [] },
    origin: { type: String, default: '' },
    packaging: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    /** When true, storefront hides list/detail price (cart still uses stored price). */
    hidePrice: { type: Boolean, default: false },
    /** Display order on storefront (lower first). Drag-reorder in admin updates this. */
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
