const mongoose = require('mongoose');

const FilingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filingType: { type: String, required: true }, // GSTR-1, GSTR-3B
    period: { type: String, required: true }, // October 2023
    status: { type: String, enum: ['Draft', 'Submitted', 'Paid'], default: 'Draft' },
    data: {
        sales: String,
        tax: String,
        itc: String,
        challanId: String
    },
    documents: [{ name: String, url: String }], // Mock URLs for now
    submittedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Filing', FilingSchema);
