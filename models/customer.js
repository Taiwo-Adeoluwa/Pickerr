const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },   
    otp: {
        type: String,
        trim: true,
        default: ()=>{
            return Math.round(Math.random() * 1e6).toString().padStart(6,"0");
        },
    },
    profilePicture: {
        secureUrl:{
            type: String,
            trim: true
        },
        profileId: {
            type: String,
            trim: true
        }
    },
    },
{timestamps:true},
);
const customerModel = mongoose.model('customerInfo', customerSchema);

module.exports = customerModel