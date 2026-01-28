// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tejastej356_db_user:i65Mk9s18JNDrBtk@cluster1.i7m2ycy.mongodb.net/?appName=Cluster1";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const filingRoutes = require('./routes/filing');

// app.use('/api', apiRoutes); // Deprecated generic routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/filing', filingRoutes);

app.get('/', (req, res) => {
    res.send('Surefile API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
