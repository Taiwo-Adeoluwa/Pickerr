const distributorModel = require('../models/distributor');
const paymentModel = require('../models/payment');
const customerModel = require('../models/customer');
const axios = require('axios')

exports.initializePaystackPayment = async (req, res) =>{
    try {
         //Get customer ID from the request user
        const customerId = req.user.id;
        //Get distributor ID from the params
        const {distributorId } = req.params;

        //Check if customer still exists
        const customer = await customerModel.findById(customerId)
        if(!customer){
            return res.status(404).json({
                message: 'Customer not found'
            })
        };
        //Check if distributor still exists
        const distributor = await distributorModel.findById(distributorId)
        if(!distributor ){
            return res.status(404).json({
                message: 'Distributor not found'
            })
        };
        //Create payment data obaject
        const paymentData = {
            //amount: parseInt(distributor.contributionAmount)
            amount : distributor.contributionAmount * 100,
            currency: 'NGN',
            email: customer.email,
            callback_url: 'https://www.google.com/'
        }

        //Initialize payment using axios
        const response = await axios.post('https://api.paystack.co/transaction/initialize', paymentData, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`
            }
        })

        //Create a payment record in our database
        const payment = new paymentModel({
            amount: distributor.contributionAmount,
            reference: `TCA-SPLITA-${response.data?.data.reference}`,
            customerId,
            distributorId,
            distributorName: distributor.distributorName
        })

        await payment.save();

        //send a success response
        res.status(200).json({
            message: 'Payment initialized successfully',
            data: response.data?.data,
            payment
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Error initializing payment'
        })
    }
}

exports.verifyPaystackPayment = async (req, res)=>{
    try {
        //Extract the reference from the query params
        const {reference} = req.query
        //verify the status of the payment from kora
        const {data} = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`
            }
        });
         //update the payment in our app
            const payment = await paymentModel.findOne({reference: `TCA-SPLITA-${reference}`})
            if(!payment){
                return res.status(404).json({
                    message: 'Payment not found'
                })
            }
        //Check the status update
        if(data?.status === true && data?.data.status === 'success'){
           
            //Update the status of the payment
            payment.status = data?.data.status;
            await payment.save()
            
            //send a success response
            return res.status(200).json({
                message: 'Payment verified successfully',
                data: payment
            })
        }else {
            payment.status = data?.data.status
            await payment.save();

             //Send a success response
        return res.status(200).json({
            message: 'payment verifification failed',
            data: payment
        })
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Error fetching payment'
        })
    }
}

exports.getAllPaystackPayments = async(req, res)=>{
    try {
        //Extract the Customer ID from the request user
        const customerId = req.user.id;
        //check if customer exists
        const customer = await customerModel.findById(customerId)
        if(!customer){
            return res.status(404).json({
                message: 'Customer not found'
            })
        }
        //Find all payments made by the customer
        const allPayments = await paymentModel.find({customerId}).sort({createdAt: -1});

        //Send a success response
        res.status(200).json({
            message: 'All payments by Customer fetched successfully',
            data: allPayments
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}