const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    businessType: { type: String }, // Proprietorship, Pvt Ltd
    category: { type: String }, // Retail, Manufacturing
    turnover: { type: String },
    gstNumber: { type: String },
    complianceOptions: [{ type: String }], // GST, TDS, etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
