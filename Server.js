//SERVER.JS FILE

const app = require('./App');
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const cors = require("cors")
dotenv.config({path : './config.env'}) 

 
const {DATABASE, DATABASE_PASSWORD, PORT} = process.env
const DB = DATABASE.replace("<password>", DATABASE_PASSWORD);
 
mongoose.connect(DB).then(con => { 
    console.log('connected to the Database')
}).catch(err => {
    console.log("an error occured", err)
})


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  
  module.exports = app; 