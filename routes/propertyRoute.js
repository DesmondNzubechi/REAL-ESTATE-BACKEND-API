//PROPERTY ROUTE

const { createProperty, getAllProperty, updateProperty, deleteAProperty, getAProperty } = require("../controllers/propertyController");
const {uploadImageToCloudinary, uploadPhoto} = require("../controllers/uploadController")

const express = require('express');
const router = express.Router();

////ROUTE FOR CREATING A PROPERTY
router.
    route('/createProperty') 
    .post(uploadPhoto, uploadImageToCloudinary,  createProperty);
     
    ////ROUTE FOR FETCHING ALL PROPERTIES
    router.get("/", getAllProperty)

    ////ROUTE FOR  UPDATING A PROPERTY
router.patch("/updateAProperty/:id", updateProperty)
    
////ROUTE FOR DELETING AND FETCHING A PROPERTY USING ITS ID
router
    .route('/:id') 
    .delete(deleteAProperty)
    .get(getAProperty)

    
module.exports = router;
 