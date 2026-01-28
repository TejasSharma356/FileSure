const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Compliance = require('../models/Compliance');

// --- User Routes ---

// Get User Profile (Mock Auth)
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create/Update Profile
router.post('/user', async (req, res) => {
    const { name, email, businessName, businessType, gstNumber } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            // Update
            user = await User.findOneAndUpdate({ email }, { $set: req.body }, { new: true });
            return res.json(user);
        }
        // Create
        user = new User({ name, email, businessName, businessType, gstNumber, password: 'mockpassword' });
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- Compliance Routes ---

// Get Compliances for User
router.get('/compliance/:userId', async (req, res) => {
    try {
        const compliances = await Compliance.find({ userId: req.params.userId }).sort({ dueDate: 1 });
        res.json(compliances);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add Compliance Item
router.post('/compliance', async (req, res) => {
    try {
        const newCompliance = new Compliance(req.body);
        const compliance = await newCompliance.save();
        res.json(compliance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
