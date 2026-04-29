const { createRequest, acceptRequest, rejectRequest, allRequestForAdmin } = require('../controller/request');
const { authentication } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/request/:distributorId', authentication, createRequest);
router.put('/request/:requestId', authentication, acceptRequest);
router.put('/request-decline/:requestId', authentication, rejectRequest);
router.get('/request-all/:distributorId', authentication, allRequestForAdmin)

module.exports = router 