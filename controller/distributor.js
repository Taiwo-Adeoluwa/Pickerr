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