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
      isVerified: {
        type: Boolean,
        default: false
    }, 
    otp: {
        type: String,
        trim: true,
        default: ()=>{
            return Math.round(Math.random() * 1e6).toString().padStart(6,"0");
        },
    },
     otpEpires: {
            type: Date,
            default: () => {
                return new Date(Date.now()+ 1 * 60 * 1000)
            }
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
     username: {
        type: String, 
        default: function(){
        return `${this.name.slice(0,4).trim() +Math.round( Math.random() * 1e3)
            .toString().padStart(3,"0")}`;
     },
     },
    },
{timestamps:true},
);
const customerModel = mongoose.model('customerInfo', customerSchema);

module.exports = customerModel