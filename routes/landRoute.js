
//LAND ROUTE

const express = require('express');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');
const { createLand, updateALand, deleteALand, getALand, getAllLand } = require('../controllers/landController');

const router = express.Router();

router
    .route('/createLand')
    .post(uploadPhoto, uploadImageToCloudinary, createLand)
 
    router
    .route("/fetchAllLand")
    .get(getAllLand)

router
    .route("/updateLand/:id")
    .patch(updateALand)

router
    .route("/deleteLand/:id")
    .delete(deleteALand)

router
    .route("/fetchALand/:id")
    .get(getALand)

    module.exports = router