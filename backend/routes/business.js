const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Business = require('../models/Business');

// @route   GET api/business
// @desc    Get current user's business profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const business = await Business.findOne({ userId: req.user.id });
        if (!business) {
            return res.status(404).json({ msg: 'Business profile not found' });
        }
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/business
// @desc    Create or update business profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const { businessName, businessType, category, gstNumber, turnover, complianceOptions } = req.body;

    // Build unique object
    const businessFields = {
        userId: req.user.id,
        businessName,
        businessType,
        category,
        gstNumber,
        turnover,
        complianceOptions
    };

    try {
        let business = await Business.findOne({ userId: req.user.id });

        if (business) {
            // Update
            business = await Business.findOneAndUpdate(
                { userId: req.user.id },
                { $set: businessFields },
                { new: true }
            );
            return res.json(business);
        }

        // Create
        business = new Business(businessFields);
        await business.save();
        res.json(business);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
