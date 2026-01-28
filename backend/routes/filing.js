const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Filing = require('../models/Filing');

// @route   GET api/filing
// @desc    Get all filings for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const filings = await Filing.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(filings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/filing
// @desc    Save a filing draft or submission
// @access  Private
router.post('/', auth, async (req, res) => {
    const { filingType, period, status, data } = req.body;

    try {
        const newFiling = new Filing({
            userId: req.user.id,
            filingType,
            period,
            status,
            data
        });

        const filing = await newFiling.save();
        res.json(filing);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
