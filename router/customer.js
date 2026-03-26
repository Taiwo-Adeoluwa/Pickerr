const { createCustomer, updateCustomer } = require('../controller/customer')
const { upload } = require('../middlewares/multer')
const router = require('express').Router();

router.post('/customer', createCustomer)
router.put('/customers/:id', upload.single('profilePicture'), updateCustomer)

module.exports = router;