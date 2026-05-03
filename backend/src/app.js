const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const agentRoutes = require('./routes/agent');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agent', agentRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
