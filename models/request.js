const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    distributorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'distributorInfo'
    },
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'customerInfo'
    },
    distributorName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    customerInfo: {
        type: String,
        required: true
    },
}, { timestamps: true });

const requestModel = mongoose.model('requests', requestSchema);

module.exports = requestModel