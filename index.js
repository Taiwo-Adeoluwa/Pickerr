require('dotenv').config()
const PORT = 4700
require('./config/database')
require('./models/customer')
const express = require('express');
const customerInfo = require('./router/customer');
const router = require('./router/customer')
const multer = require('multer')
const app = express()
app.use(express.json())
app.use(customerInfo)
app.use(router)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})