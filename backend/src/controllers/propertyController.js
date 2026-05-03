const Property = require('../models/Property');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getProperties = async (req, res) => {
  try {
    const { city, type, bhk, minPrice, maxPrice, nearMetro, page = 1, limit = 12 } = req.query;
    const filter = { available: true };

    if (city) filter['location.city'] = new RegExp(escapeRegex(city), 'i');
    if (type) filter.type = type;
    if (bhk) filter.bhk = Number(bhk);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (nearMetro === 'true') filter['location.nearMetro'] = true;

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ properties, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('listedBy', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, listedBy: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.listedBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
