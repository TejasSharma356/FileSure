require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey_should_be_in_env');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message); // Debug Log
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
