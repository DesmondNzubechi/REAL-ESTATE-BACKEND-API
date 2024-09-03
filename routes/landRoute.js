
//LAND ROUTE

const express = require('express');
const { uploadPhoto, uploadImageToCloudinary } = require('../controllers/uploadController');
const { createLand, updateALand, deleteALand, getALand, getAllLand } = require('../controllers/landController');

const router = express.Router();

//ROUTE FOR CREATING A LAND
router
    .route('/createLand')
    .post(uploadPhoto, uploadImageToCloudinary, createLand)
 
    //ROUTE FOR FETCHING ALL LAND
    router
    .route("/fetchAllLand")
    .get(getAllLand)

    //ROUTE FOR UPDATING A LAND
router
    .route("/updateLand/:id")
    .patch(updateALand)


    //ROUTE FOR DELETING A LAND
router
    .route("/deleteLand/:id")
    .delete(deleteALand)

    //ROUTE FOR FETCHING A LAND USING ITS ID
router
    .route("/fetchALand/:id")
    .get(getALand)

    module.exports = router