const express = require('express');
const { getProperties, getProperty, createProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', protect, requireRole('seller', 'admin'), createProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
