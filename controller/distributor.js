const distributorModel = require('../models/distributor');

exports.createDistributor = async (req, res) => {
    try {
      const {distributorName, orderAmount, requisitionFrequency, payoutFrequency, describeDistributor, totalDistributors}   = req.body;

      const distributor = new distributorModel({
        distributorName,
        orderAmount,
        requisitionFrequency,
        payoutFrequency,
        describeDistributor,
        totalDistributors,
        createdBy: req.customer.id
      })
      await distributor.save()

      res.status(201).json({
        message: 'Distributor created succesfullly',
        data: distributor
      })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: 'Something went wrong'
        })
    }
}

exports.getAll = async(req, res)=>{
  try {
    const allDistributors = await distributorModel.find().select('distributorName orderAmount' )
    res.status(200).json({
      message: 'Distributors found',
      data: allDistributors
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

exports.getOne = async (req,res)=>{
  try {
    const getDistributor = await distributorModel.findOne().select('distributorName orderAmount totalDistributors')
    res.status(200).json({
      message: 'Distributor gotten successfully',
      data: getDistributor
    })

  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

  
exports.removeMemberFromGroup = async(req, res) =>{
    try {
        // Get the logged in user ID from the request user
        const { id } = req.user;
        // Get the distributor and member ID from the params
        const { distributorId, memberId } = req.params;
        //check if distributor exists
        const distributor = await distributorModel.findById(distributorId);
        if(!distributor){
            return res.status(404).json({
                message: 'Distributor not found'
            })
        }
        //Check if the person trying to remove a member is the admin
        if (distributor.createdBy.toString() !== id){
            return res.status(403).json({
                message: 'Unauthorized Access, Not an admin'
            })
        }

        //check if the member to be removed is the admin
        if(distributor.createdBy.toString() === memberId){
            return res.status(403).json({
                message: 'Unauthorized Access, Cannot remove admin'
            })
        }

        //Check if member is a distributor
        const memberIndex = distributor.members.findIndex((element) => element.toString() === memberId);
        if(memberIndex == -1) {
            return res.status(404).json({
                message: 'User is not a member of the distributors'
            })
        }

        //Remove a member from the distributors
        distributor.members.splice(memberIndex, 1);

        // Save changes to the database
        await distributor.save();

        //Send a success response
        res.status(200).json({
            message: 'Member removed successfully',
            data: distributor
        })
        
    } catch (error) {
       console.log(error.message)
       res.status(500).json({
        message: 'Something went wrong'
       }) 
    }
}
