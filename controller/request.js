const requestModel = require('../models/request');
const distributorModel = require('../models/distributor');
const customerModel = require('../models/customer');

exports.createRequest = async(req, res) =>{
    try {
        //Get the customer ID from the request user
        const { id } = req.user;
        //Get the distributor ID from the params
        const {distributorId} = req.params;

        const distributor = await distributorModel.findById(distributorId);
        if(!distributor){
            return res.status(404).json({
                message: 'Distributor not found'
            })
        }

        //Check if customer is a distributor
        const checkMemebership = distributor.members.find(member => member.toString() === id);
        if(checkMemebership) {
            return res.status(400).json({
                message: 'You are already a distributor'
            })
        }
        //Find customer and check if customer still exists
        const customer = await customerModel.findById(id);
        if(!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        //Check if customer has already sent a request to join the group
        const pendingRequest = await requestModel.findOne({distributorId, customerId: id, status: 'Pending'});
        if(!pendingRequest){
            return res.status(404).json({
                message: 'You have already sent a request to be a distributor'
            })
        }
        //Create an instance of a distributor request
        const request = new requestModel({
            distributorId,
            distributorName: distributor.distributorName,
            customerId: id,
            customerInfo: customer.name
        })

        await request.save();
        //Send a success response
        res.status(200).json({
            message: 'Request sent successfully',
            data: request
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.allRequestForAdmin = async(req, res) => {
    try {
        const {id} = req.user;
        const {distributorId} = req.params;

        const distributor = await distributorModel.findById(distributorId)
        if(!distributor) {
            return res.status(404).json({
                message: 'Distributor not found'
            })
        }

        //Check if the person trying to see the result is the Admin
        if(distributor.createdBy.toString() !== id) {
            return res.status(403).json({
                message: 'Unauthorized to view request, Not an admin'
            })
        }
        //Find all requests for the distributor 
        const requests = await requestModel.find({ distributorId });

        res.status(200).json({
            message: 'All requests found',
            data: requests
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        //Get the Admin ID from request user
        const adminId = req.user.id;
        const {requestId} = req.params;
        //Check if request exists
        const request = await requestModel.findById(requestId)
        if(!request){
            return res.status(404).json({
                message: 'Request not found'
            })
        }

        if(request.status === 'Accepted' || request.status === 'Rejected') {
            return res.status(400).json({
                message: 'Request already processed'
            })
        }

        //Find the group and confirm if the Admin ID matches the distributor ID
        const distributor = await distributorModel.findById(request.distributorId)
        if(!distributor) {
            return res.status(404).json({
                message: 'Distributor not found'
            })
        }

        //Confirm the admin ID
        if(distributor.createdBy.toString !== adminId) { 
            return res.status(403).json({
                message: 'Unauthorized: Not an admin'
            })
        }

        //Add the customer to the distributor and update the status of the request
        distributor.members.push(request.customerId);
        request.status = 'Accepted';

        //Save changes in the database
        await distributor.save();
        await request.save();

        //Send a success response
        res.status(200).json({
            message: 'Request accepted successfully',
            data : request
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const adminId = req.user.id;
        const {requestId} = req.params;

        const request = await requestModel.findById(requestId)
        if(!request){
            return res.status(404).json({
                message: 'Request not found'
            })
        }

        if (request.status === 'Accepted' || request.status === 'Rejected') {
            return res.status(400).json({
                message: 'Request already processed',
            })
        }

        //Find the distributor and confirm if the Admin ID matches the group ID
        const distributor = await distributorModel.findById(request.distributorId)
        if(!distributor){
            return res.status(404).json({
                message: 'Distributor not found'
            })
        }

        //Confirm the admin ID
        if(distributor.createdBy.toString() !== adminId) {
            return res.status(403).json({
                message: 'Unauthorized: Not an admin'
            })
        }

        request.status = 'Rejected';
        //Save changes in the database
        await request.save();

        res.status(200).json({
            message: 'Request rejected successfully',
            data: request
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}