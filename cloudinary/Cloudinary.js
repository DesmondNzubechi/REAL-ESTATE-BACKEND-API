

const cloudinary = require('cloudinary').v2

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME} = process.env

cloudinary.config({
    secure: true,
    cloud_name: "dtkw637ze",
    api_key: "913834565681728",
    api_secret: "ZOsmRiy3IRkqFNyGJMa38pGK5Xg"
});

module.exports = cloudinary;
