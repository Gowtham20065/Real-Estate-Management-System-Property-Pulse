const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['apartment', 'villa', 'plot', 'commercial'],
    required: true,
  },
  bhk: { type: Number }, // e.g. 1, 2, 3
  price: { type: Number, required: true }, // in lakhs
  location: {
    city: { type: String, required: true, index: true },
    area: String,
    pincode: String,
    nearMetro: { type: Boolean, default: false },
  },
  area: {
    size: Number, // sq ft
    unit: { type: String, default: 'sqft' },
  },
  amenities: [String], // e.g. ['gym', 'parking', 'pool']
  images: [String],
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

// Compound index for the most common filter combination
propertySchema.index({ 'location.city': 1, price: 1, type: 1, bhk: 1 });

module.exports = mongoose.model('Property', propertySchema);
