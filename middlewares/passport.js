const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const customerModel = require('../models/customer')
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL
  },
  async(accessToken, refreshToken, Profile, cb) => {
    try {
        console.log('profile', Profile)
        let customer = await customerModel.findOne({email: Profile._raw.email});

        if(!customer){
            customer = new customerModel({
                name: Profile._raw.name,
                phoneNumber: `${Math.floor(Math.random() * 1E11)}`,
                email: Profile._raw.email,
                isVerified: Profile._raw.email_verified,
                password: ' ',
                profilePicture: Profile._raw.picture
            })
        }
        return cb(null, customer)

    } catch (error) {
       return cb(null, error) 
    }
  }
));

passport.serializeUser((customer, cb) =>{
    cb(null, customer.id)
});

passport.deserializeUser(async(id, cb) =>{
    const custumer = await customerModel.findById(id);

    if(!customer){
        return cb(new Error('Customer not found'), null)
    }
    cb(null, customer)
});

const profile = passport.authenticate('google',{scope: ['profile', 'email']});

const loginProfile = passport.authenticate('google', { failureRedirect: '/login'});

module.exports = { passport, profile, loginProfile}