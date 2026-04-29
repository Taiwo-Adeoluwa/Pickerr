const { createCustomer, updateCustomer, verifyEmail, login, resendEmail, forgotPassword, resetPassword, changePassword, loginWithGoogle } = require('../controller/customer');
const { authentication } = require('../middlewares/auth');
const { upload } = require('../middlewares/multer');
const { profile, loginProfile } = require('../middlewares/passport');
const { signupValidator, resetPasswordValidator, changePasswordValidator } = require('../middlewares/validator');
const router = require('express').Router();

router.post('/customer', signupValidator ,createCustomer)
router.put('/customers/:id', upload.single('profilePicture'), updateCustomer)
router.post('/customer/check', verifyEmail);
router.post('/login', login)
router.post('/check', resendEmail)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPasswordValidator ,resetPassword)
router.post('/change-password',authentication, changePasswordValidator, changePassword)

//Google signup endpoints
router.get('/auth/google', profile)
router.get('/auth/google/callback', loginProfile, loginWithGoogle)


module.exports = router;