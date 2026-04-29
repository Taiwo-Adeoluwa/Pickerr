const joi = require('joi')

exports.signupValidator = (req, res, next)=>{

    const schema = joi.object({
        name: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name cannot be empty',
            'string.pattern.base': 'Name cannot contain numbers and must be at least 4 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
          'any.required': 'Phone number is required',
          'string.empty': 'Phone number cannot be empty',
          'string.pattern.base': 'Phone number must only contain numbers and must be 11 digits'  
        }),
        password: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
          'any.required': 'Password is required',
          'string.empty': 'Password cannot be empty',
          'string.pattern.base': 'Password must be at least 8 characters and must include 1 uppercase and 1 lowercase' 
        }),
        address: joi.string().trim().pattern(/^[a-zA-Z0-9,.\s]+$/).required().messages({
            'any.required': 'Address is required',
            'string.empty': 'Address cannot be empty',
            'string.pattern.base': 'Address can only contain letters, numbers and special characters like comma and full stop only'
        }),
    })

    const { error } = schema.validate(req.body);
     //console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}

exports.addValidator = (req, res, next)=> {
    const schema = joi.object({
        distributorName: joi.string().trim().pattern(/^(?=.*[A-Z])(?=.*[a-z]).{5,}$/
).required().messages({
    'any.required': 'Distributor name is required',
    'string.empty': 'Distributor name is not allowed to be empty',
    'string.pattern.base': 'Distributor name must not be less than 5 characters and must contain at least 1 uppercase and one lowercase'
}),
orderAmount: joi.string().pattern(/^\d{5,}$/
).required().messages({
    'any.required': 'Order amount field is required',
    'string.empty': 'Order amount is not allowed to be empty',
    'string.pattern.base': 'Order amount can only be numbers and cannot be less than 5 digits'
}),
requisitionFrequency: joi.string().pattern(/^(daily|weekly|monthly)$/i
).required().messages({
     'any.required': 'Requisition frequency field is required',
    'string.empty': 'Requisition frequency is not allowed to be empty',
    'string.pattern.base': 'Requisition frequency is strictly daily, weekly or monthly'
}),
payoutFrequency: joi.string().pattern(/^(daily|weekly|monthly)$/i
).required().messages({
     'any.required': 'Payout frequency field is required',
    'string.empty': 'Payout frequency is not allowed to be empty',
    'string.pattern.base': 'Payout frequency is strictly daily, weekly or monthly'
}),
describeDistributor: joi.string().trim().pattern(/^[A-Za-z](?!.*  )[A-Za-z ]{18,48}[A-Za-z]$/
).required().messages({
    'any.required': 'Describe distributor field is required',
    'string.empty': 'Describe distributor is not allowed to be empty',
    'string.pattern.base': 'Describe distributor can only be letters and can only contain atleast 20 characters and maximum 50 characters'
}),
totalDistributors: joi.string().pattern(/^([2-9]|1[0-2])$/
).required().messages({
    'any.required': 'Total distributors field is required',
    'string.empty': 'Total distributors is not allowed to be empty',
    'string.pattern.base': 'Total distributors can only be numbers and cannot be more than 2 digits with minimum members of 2 and maximum 12'
})
    })
    const {error} =  schema.validate(req.body);
    // console.log(error.details[0])
   
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.resetPasswordValidator = (req, res, next)=>{
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        Otp: joi.string().pattern(/^\d{6}$/).required().messages({
          'any.required': 'OTP is required',
          'string.empty': 'OTP cannot be empty',
          'string.pattern.base': 'OTP must only contain numbers and must be 6 digits'  
        }),
        password: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
          'any.required': 'Password is required',
          'string.empty': 'Password cannot be empty',
          'string.pattern.base': 'Password must be at least 8 characters and must include 1 uppercase and 1 lowercase' 
        }),
        confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
          'any.only': 'confirm password must match password',
          'any.required': 'confirm password is required'
        })
    })

    const { error } = schema.validate(req.body);
    // console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.changePasswordValidator = (req, res, next)=>{
    const schema = joi.object({
        oldPassword: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
          'any.required': 'old password is required',
          'string.empty': 'old password cannot be empty',
          'string.pattern.base': 'old password must be at least 8 characters and must include 1 uppercase and 1 lowercase'
        }),
        newPassword: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
          'any.required': 'new password is required',
          'string.empty': 'new password cannot be empty',
          'string.pattern.base': 'new password must be at least 8 characters and must include 1 uppercase and 1 lowercase' 
        }),
        confirmPassword: joi.string().required().valid(joi.ref('newPassword')).messages({
          'any.only': 'confirm password must match New password',
          'any.required': 'confirm password is required'
        })
    })

    const { error } = schema.validate(req.body);
    // console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}