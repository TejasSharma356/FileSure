require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/chat', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'ComplyEase-Backend' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
