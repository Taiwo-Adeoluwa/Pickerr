const jwt = require('jsonwebtoken');
const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header missing'
            });
        }
        
        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            })
        }
        const validToken = await jwt.verify(token, process.env.secretKey, (err, data) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({
                    message: 'Token validation failed'
                })
            }
            req.customer = data
            next() 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    authentication
}