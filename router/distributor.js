const {createDistributor} = require('../controller/distributor')
const { authentication } = require('../middlewares/auth')
const router = require('express').Router()

router.post('/distributor',authentication, createDistributor)

module.exports = router