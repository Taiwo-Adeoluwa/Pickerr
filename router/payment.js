const { initializePayment, verifyPayment, getAllPaymentByUser } = require('../controller/payment');
const { initializePaystackPayment, verifyPaystackPayment, getAllPaystackPayments } = require('../controller/paystack');
const { authentication } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/make-payment/:distributorId', authentication, initializePayment)
router.post('/make-payment-paystack/:distributorId', authentication, initializePaystackPayment)
router.get('/verify-payment', authentication, verifyPayment)
router.get('/verify-payment-paystack', authentication, verifyPaystackPayment)
router.get('/all-payment', authentication, getAllPaymentByUser)
router.get('/all-payment-paystack', authentication, getAllPaystackPayments)

module.exports = router