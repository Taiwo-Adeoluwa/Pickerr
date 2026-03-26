require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.mongo_cred).then(()=>{
    console.log('Connected to Database');
}).catch((error) => { 
    console.error('Error connecting to Database:', error.message);
});  