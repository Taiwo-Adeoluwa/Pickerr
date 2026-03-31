const mongoose = require('mongoose');
const distributorSchema = new mongoose.Schema({
    distributorName: {
        type: String,
        require: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerInfo',
        required: true
    },
    orderAmount: {
        type: String,
        require: true,
        trim: true
    },
    requisitionFrequency: {
        type: String,
        enum:['Daily', 'Weekly', 'Monthly'],
        require: true,
        trim: true
    },
    payoutFrequency: {
        type: String,
        enum:['Daily', 'Weekly', 'Monthly'],
        trim: true
    },
    describeDistributor : {
        type: String,
        require: true,
        trim: true
    },
    totalDistributors: {
        type: String,
        require: true,
        trim: true
    },
    },
{timestamps:true},
);
const distributorModel = mongoose.model('distributorInfo', distributorSchema);

module.exports = distributorModel