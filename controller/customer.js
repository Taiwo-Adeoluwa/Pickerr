require('dotenv').config() 
const customerModel = require('../models/customer');
const cloudinary = require('../middlewares/cloudinary')
const fs = require('fs')
const bcrypt = require('bcrypt')
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
            email, 
            phoneNumber,
            password: hashPassword
        })
        res.status(201).json({
            message: 'customer created successfully',
            data: customer
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
