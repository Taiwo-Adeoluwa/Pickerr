const { createCustomer, updateCustomer, verifyEmail, login, resendEmail } = require('../controller/customer')
const { upload } = require('../middlewares/multer')
const router = require('express').Router();

router.post('/customer',upload.single(), createCustomer)
router.put('/customers/:id', upload.single('profilePicture'), updateCustomer)
router.post('/customer/check', verifyEmail);
router.post('/login', login)
router.post('/check', resendEmail)
module.exports = router;