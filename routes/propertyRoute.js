//PROPERTY ROUTE

const { createProperty, getAllProperty, updateProperty, deleteAProperty, getAProperty } = require("../controllers/propertyController");
const {uploadImageToCloudinary, uploadPhoto} = require("../controllers/uploadController")

const express = require('express');
const router = express.Router();

router.
    route('/createProperty')
    .post(uploadPhoto, uploadImageToCloudinary,  createProperty);
     
    router.get("/", getAllProperty)

    router.patch("/updateAProperty/:id", updateProperty)
router
    .route('/:id') 
    .delete(deleteAProperty)
    .get(getAProperty)

module.exports = router;
