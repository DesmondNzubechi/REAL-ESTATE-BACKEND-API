const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv");

dotenv.config({path : './config.env'})

const { CLOUDINARY_API_KEY, PORT, CLOUDINARY_API_SECRET, CLOUD_NAME} = process.env

console.log("cloud", CLOUDINARY_API_KEY, PORT)

cloudinary.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

module.exports = cloudinary;