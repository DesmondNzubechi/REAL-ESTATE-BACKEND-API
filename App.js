const express = require("express");


const app = express();


app.use((req, res, next) => {
    console.log("Hello from the middleware")
});




module.exports = app;