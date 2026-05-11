require('dotenv').config()
const PORT = 4700
require('./config/database')
// require('./models/customer')
require('./models/distributor')
const express = require('express');
const express_session = require('express-session')
const paymentRouter = require('./router/payment');
const distributorRouter = require('./router/distributor')
const requestRouter = require('./router/request')
const router = require('./router/customer')
const multer = require('multer')

require('./middlewares/passport')
const passport = require('passport')
const app = express()
app.use(express.json())

app.use(express_session({
  secret: 'dabest',
  resave: true,
  saveUninitialized: true
 }))
 app.use(passport.initialize());
 app.use(passport.session())
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/distributor',distributorRouter)
app.use('/api/v1',router)
app.use('/api/v1/request',requestRouter)

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'  
  })
})

app.use((err, req, res, next)=>{

  if(err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session expired: please login to continue'
            })
        }

        if(err.name === 'MulterError'){
          return res.status(400).json({
            message: err.message
          })
        }
  console.log(err.message)
  res.status(500).json({
    message: 'something went wrong'
  })
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})