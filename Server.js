const app = require('./App');
const dotenv = require('dotenv')
const mongoose = require("mongoose");

dotenv.config({path : './config.env'}) 

 
const {DATABASE, DATABASE_PASSWORD, PORT} = process.env
const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);
 
mongoose.connect(DB, {
    useNewURLParser: true,
    useUnifiedTopology: true,          
}).then(con => { 
    console.log('connected to the Database')
}).catch(err => {
    console.log("an error occured", err)
})
 
app.listen(PORT, () => {
    console.log(`app running on ${PORT}`) 
})