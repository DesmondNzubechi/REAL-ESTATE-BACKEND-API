const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv");

dotenv.config({path : './config.env'})


//CONFIGURATION OF CLOUDINARY USING THE REQUIRED CREDENTIAL

const { CLOUDINARY_API_KEY, PORT, CLOUDINARY_API_SECRET, CLOUD_NAME} = process.env


cloudinary.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

module.exports = cloudinary;