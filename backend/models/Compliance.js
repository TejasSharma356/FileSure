const mongoose = require('mongoose');

const ComplianceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }, // e.g., GSTR-1
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
    type: { type: String }, // GST, TDS, ROC
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compliance', ComplianceSchema);
