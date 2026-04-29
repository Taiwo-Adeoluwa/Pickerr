const {createDistributor, getAll, getOne, removeMemberFromGroup} = require('../controller/distributor')
const { authentication } = require('../middlewares/auth')
const { addValidator } = require('../middlewares/validator')
const router = require('express').Router()

router.post('/distributor',authentication, addValidator, createDistributor)
router.get('/distributor',authentication, getAll)
router.get('/distributors',authentication, getOne)
router.patch('/distributor/:distributorId/:memberId', authentication, removeMemberFromGroup)

module.exports = router