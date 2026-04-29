const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    customerId : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userInfo',
        required: true
    },
    distributorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'groupInfo',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    distributorName: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['processing', 'success', 'failed', 'abandoned'],
        default: 'processing'
    }
    
}, {timestamps: true});

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel