//SERVER.JS FILE

const app = require('./App');
const dotenv = require('dotenv')
const mongoose = require("mongoose");

dotenv.config({path : './config.env'}) 

 
const {DATABASE, DATABASE_PASSWORD, PORT, } = process.env
const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);
 


//connect to the database
mongoose.connect(DB).then(con => { 
    console.log('connected to the Database')
}).catch(err => {
    console.log("an error occured", err)
})


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  
  module.exports = app; 