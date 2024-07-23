const express = require('express');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');
const { createLand } = require('../controllers/landController');

const router = express.Router();

router
    .route('/createLand')
    .post(uploadPhoto, uploadImageToCloudinary, createLand)

    module.exports = router