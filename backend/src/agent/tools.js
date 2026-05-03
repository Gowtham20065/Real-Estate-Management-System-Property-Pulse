const { DynamicStructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');
const Property = require('../models/Property');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const searchPropertiesTool = new DynamicStructuredTool({
  name: 'search_properties',
  description: 'Search properties by location, price range, BHK, type, and metro proximity. Returns matching listings.',
  schema: z.object({
    city: z.string().optional().describe('City name, e.g. Hyderabad, Bangalore'),
    area: z.string().optional().describe('Specific area or neighbourhood'),
    type: z.enum(['apartment', 'villa', 'plot', 'commercial']).optional(),
    bhk: z.number().optional().describe('Number of bedrooms, e.g. 2 for 2BHK'),
    minPrice: z.number().optional().describe('Minimum price in lakhs'),
    maxPrice: z.number().optional().describe('Maximum price in lakhs'),
    nearMetro: z.boolean().optional().describe('Whether property should be near a metro station'),
    limit: z.number().optional().default(5),
  }),
  func: async ({ city, area, type, bhk, minPrice, maxPrice, nearMetro, limit }) => {
    const filter = { available: true };
    if (city) filter['location.city'] = new RegExp(escapeRegex(city), 'i');
    if (area) filter['location.area'] = new RegExp(escapeRegex(area), 'i');
    if (type) filter.type = type;
    if (bhk) filter.bhk = bhk;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (nearMetro !== undefined) filter['location.nearMetro'] = nearMetro;

    const properties = await Property.find(filter).limit(limit).sort({ price: 1 });
    if (!properties.length) return 'No properties found matching these criteria.';

    return JSON.stringify(
      properties.map(p => ({
        id: p._id,
        title: p.title,
        type: p.type,
        bhk: p.bhk,
        price: `₹${p.price}L`,
        city: p.location.city,
        area: p.location.area,
        nearMetro: p.location.nearMetro,
        size: p.area?.size ? `${p.area.size} sqft` : null,
        amenities: p.amenities,
      }))
    );
  },
});

const recommendPropertiesTool = new DynamicStructuredTool({
  name: 'recommend_properties',
  description: 'Get top recommended properties ranked by value — best price-to-size ratio for a given city and budget.',
  schema: z.object({
    city: z.string().describe('City to search in'),
    maxPrice: z.number().describe('Maximum budget in lakhs'),
    type: z.enum(['apartment', 'villa', 'plot', 'commercial']).optional(),
  }),
  func: async ({ city, maxPrice, type }) => {
    const filter = {
      available: true,
      'location.city': new RegExp(escapeRegex(city), 'i'),
      price: { $lte: maxPrice },
    };
    if (type) filter.type = type;

    const properties = await Property.find(filter).limit(10);
    if (!properties.length) return 'No recommendations available for this city and budget.';

    // Rank by price-to-size ratio (lower = better value)
    const ranked = properties
      .filter(p => p.area?.size)
      .sort((a, b) => (a.price / a.area.size) - (b.price / b.area.size))
      .slice(0, 5);

    return JSON.stringify(
      ranked.map((p, i) => ({
        rank: i + 1,
        id: p._id,
        title: p.title,
        price: `₹${p.price}L`,
        size: `${p.area.size} sqft`,
        valueScore: `₹${((p.price * 100000) / p.area.size).toFixed(0)}/sqft`,
        area: p.location.area,
        amenities: p.amenities,
      }))
    );
  },
});

const getPropertyDetailsTool = new DynamicStructuredTool({
  name: 'get_property_details',
  description: 'Get full details of a specific property by its ID.',
  schema: z.object({
    propertyId: z.string().describe('The MongoDB ID of the property'),
  }),
  func: async ({ propertyId }) => {
    const property = await Property.findById(propertyId).populate('listedBy', 'name email');
    if (!property) return 'Property not found.';
    return JSON.stringify(property);
  },
});

module.exports = [searchPropertiesTool, recommendPropertiesTool, getPropertyDetailsTool];
