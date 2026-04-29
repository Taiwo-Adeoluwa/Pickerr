require('dotenv').config() 
const customerModel = require('../models/customer');
const cloudinary = require('../middlewares/cloudinary')
const {brevo} = require('../utils/brevo')
const fs = require('fs')
const bcrypt = require('bcrypt')
const {emailTemplate, resetPasswordTemplate} = require('../email')
const jwt = require('jsonwebtoken')

exports.createCustomer = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(password, salt)

        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }
        const customer = await customerModel.create({
            name,
            email: email.toLowerCase(), 
            phoneNumber,
            password: hashPassword
        })
         const customers = await customerModel.find()
        const newCustomer = new customerModel(customer)
        brevo(newCustomer.email, newCustomer.name, emailTemplate(newCustomer.name, newCustomer.otp))
        await newCustomer.save()


        res.status(201).json({
            message: 'customer created successfully',
            data: customer,
            count: customers.length
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: 'something went wrong'
        });
    }
};

exports.updateCustomer = async(req, res) =>{
    try {
         const file = req.file

        const uploadToCloudinary = await cloudinary.uploader.upload(file.path);
        console.log("uploadToCloudinary:", uploadToCloudinary)

        const extractSecureUrl = uploadToCloudinary.secure_url;
        console.log("extractSecureUrl:", extractSecureUrl)

        if(!req.file){
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }
        const filePath = req.file.path;
        await fs.promises.unlink(filePath);

        const {address} = req.body;
        const {id} = req.params;
        const profilePicture = {
            secureUrl: extractSecureUrl,
            publicId: uploadToCloudinary.public_id
        }
        
        const newUpdate = await customerModel.findByIdAndUpdate (id, {address, profilePicture}, 
            {new:true })
        
        res.status(200).json({
            message: ' customer information updated successfully',
            data: newUpdate
        })
    }catch (error){
        res.status(400).json({
            message: error.message
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const customer = await customerModel.findOne({ email: email.toLowerCase() })
        console.log(customer)

        if (!customer) {
            return res.status(404).json({
                message: 'customer not found'
            })
        };

        if (customer.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP Provided'
            })
        };

        if (customer.otpExpires < Date.now()) {
            return res.status(400).json({
                message: 'OTP has expired'
            })
        };
        customer.isVerified = true;
        customer.otp = null;
        customer.otpExpires = null;
        await customer.save();

        res.status(200).json({
            message: 'OTP Verified successfully',
            data: customer
        })
    } catch (error) {
        console.log(error.message),
            res.status(500).json({
                message: "Something went wrong"
            })
    }
};

exports.resendEmail = async(req, res) =>{
    try {
        const {email} = req.body
        const customer = await customerModel.findOne({
            email: email.toLowerCase()
        })
        if(!customer){
            return res.status(404).json({
                message: "Customer not found"
            })
        }
           const html = await emailTemplate(customer.name, customer.otp)

        const userData = {
            email: customer.email,
            subject: 'Verify Email',
            html
        } 

        await sendEmail(userData)
        customer.otp = Math.round(Math.random() * 1e6).toString().padStart(6, '0');
        customer.otpExpires = Date.now() + (1000 * 60 * 3);
        await customer.save();
        res.status(201).json({
            message: "OTP resent to Email",
        })
    } catch (error) {
        console.log(error.message),
            res.status(500).json({
                message: "Something went wrong"
            })
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password}= req.body;
        const customer = await customerModel.findOne({email:email.toLowerCase()})

        if(!customer) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            })
        };

        const correctPassword = await bcrypt.compare(password, customer.password)

        if(!correctPassword) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        };

        if(customer.isVerified ==false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        const token = jwt.sign(
            {id: customer._id}, 
            process.env.secretKey,
            {expiresIn: '40m'}
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            customer
        })
    } catch (error) {
       console.log(error.message),
       res.status(500).json({
        message: 'Something went wrong'
       }) 
    }
}

exports.forgotPassword = async(req, res) =>{
    try {
        const {email} = req.body;
        const customer = await customerModel.findOne({email: email.toLowerCase()})

        if (customer == null){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        const OTP = Math.round(Math.random() * 1e6).toString().padStart(6,"0");
        customer.otp = OTP;

        customer.otpEpires = Date.now() + ( 5 * 60 * 1000);
        const data = {
            name: customer.name,
            otp: OTP
        }

        //Send the email to the Customer
        brevo(email, customer.name, resetPasswordTemplate(data));
        await customer.save()

        res.status(200).json({
            message: 'Forgot password successful'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try {
        const {otp, password, email} = req.body;
        const customer = await customerModel.findOne({email: email.toLowerCase()})
        if(customer == null){
            return res.status(404).json({
                message: 'Invalid credentials'
            })
        }

       if(Date.now() > customer.otpExpires || otp !== customer.otp) {
      return res.status(400).json({
        message: 'Invalid OTP'
      })
    } 

    //Reset the customer's with the encrypted and updated password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    customer.password = hashPassword
    await customer.save();

    res.status(200).json({
        message: 'Password reset successfully'
    })

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.changePassword = async(req,res)=>{
    try {
        const {id} = req.user;
        const {oldPassword, newPassword} = req.body;
        const customer = await customerModel.findById(id);

        if(!customer){
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        const checkPassword = await bcrypt.compare(oldPassword, customer.password);
        if(!checkPassword){
            return res.status(400).json({
                message: 'Old password is invalid'
            })
        }

        //Encrypt and change to the new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt)
        customer.password = hashPassword;

        await customer.save();

        res.status(200).json({
            message: ' Password changed successfully'
        })

    } catch (error) {
       res.status(400).json({
        message: error.message
       }) 
    }
}

exports.loginWithGoogle = async(req, res) =>{
    try {
        const token = await jwt.sign({
            id:req.user._id
        }, process.env.secretKey,
            {expiresIn: '40m'})

            res.status(200).json({
                message: 'Login successful',
                data: req.user.name,
                token
            })
            
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllCustomer = async(req, res) =>{
  try {
    const customers = await customerModel.find();
    //Send a success response
    res.status(200).json({
      message: 'All customers',
      data: customers
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.deleteCustomer = async(req, res) =>{
  try {
      const { id } = req.params;
      const customers = await customerModel.findByIdAndDelete(id);
      if (!customers) {
        return res.status(404).json({
          message: 'Customer not found'
        })
      }
      //Send a success response
      res.status(200).json({
        message: 'Customer deleted successfully',
        data: customers
      })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}