const mongoose = require('mongoose')

mongoose.connect('mongodb://omogunloyetaiwo5_db_user:yhfsx0BNs2uPyoMQ@ac-mile7kg-shard-00-00.afxeztb.mongodb.net:27017,ac-mile7kg-shard-00-01.afxeztb.mongodb.net:27017,ac-mile7kg-shard-00-02.afxeztb.mongodb.net:27017/?ssl=true&replicaSet=atlas-ezjyok-shard-0&authSource=admin&appName=Cluster0').then(()=>{
    console.log('Connected to Database');
}).catch((error) => { 
    console.error('Error connecting to Database:', error.message);
});  