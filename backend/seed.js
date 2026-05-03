require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Property = require('./src/models/Property');

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI. Add MONGO_URI to backend/.env before running seed.js.');
  process.exit(1);
}

if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map(server => server.trim()).filter(Boolean));
}

const seed = [
  { title: 'Spacious 2BHK near Hitech City', type: 'apartment', bhk: 2, price: 38, location: { city: 'Hyderabad', area: 'Hitech City', nearMetro: true }, area: { size: 1100 }, amenities: ['gym', 'parking', 'security'], available: true },
  { title: 'Luxury 3BHK Villa in Jubilee Hills', type: 'villa', bhk: 3, price: 120, location: { city: 'Hyderabad', area: 'Jubilee Hills', nearMetro: false }, area: { size: 2400 }, amenities: ['pool', 'gym', 'garden', 'parking'], available: true },
  { title: 'Affordable 1BHK Flat in Kukatpally', type: 'apartment', bhk: 1, price: 22, location: { city: 'Hyderabad', area: 'Kukatpally', nearMetro: true }, area: { size: 650 }, amenities: ['parking', 'security'], available: true },
  { title: 'Premium 2BHK in Whitefield', type: 'apartment', bhk: 2, price: 55, location: { city: 'Bangalore', area: 'Whitefield', nearMetro: false }, area: { size: 1250 }, amenities: ['gym', 'pool', 'parking'], available: true },
  { title: '3BHK Villa in Koramangala', type: 'villa', bhk: 3, price: 95, location: { city: 'Bangalore', area: 'Koramangala', nearMetro: false }, area: { size: 2100 }, amenities: ['garden', 'parking', 'security'], available: true },
  { title: 'Metro-side 2BHK in Indiranagar', type: 'apartment', bhk: 2, price: 68, location: { city: 'Bangalore', area: 'Indiranagar', nearMetro: true }, area: { size: 1150 }, amenities: ['gym', 'parking'], available: true },
  { title: 'Budget 2BHK in Wakad', type: 'apartment', bhk: 2, price: 42, location: { city: 'Pune', area: 'Wakad', nearMetro: false }, area: { size: 980 }, amenities: ['parking', 'security'], available: true },
  { title: 'Modern 3BHK in Baner', type: 'apartment', bhk: 3, price: 75, location: { city: 'Pune', area: 'Baner', nearMetro: false }, area: { size: 1600 }, amenities: ['gym', 'pool', 'parking', 'clubhouse'], available: true },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const shouldReset = process.argv.includes('--reset');
  const existingCount = await Property.countDocuments({});

  if (shouldReset) {
    await Property.deleteMany({});
  } else if (existingCount > 0) {
    console.log(`Skipped seeding because ${existingCount} properties already exist. Run "node seed.js --reset" to replace them.`);
    process.exit(0);
  }

  await Property.insertMany(seed);
  console.log(`Seeded ${seed.length} properties`);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
