//propertyController

const AppError = require('../errors/appError');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');


//CREATING NEW DOCUMENT
exports.createProperty = catchAsync(async (req, res, next) => {


    //DESTRUCTURE THE FIELD FROM REQUEST BODY
    const { status, name, price, map, type, location, amenities, exteriorFeatures, description, developmentStatus, yearBuilt, bedroom, bathroom, garadge } = req.body;

    //This are for the required field, if the field is empty while trying to create a property then return an error message
    if (!name || !price || !status || !map || !type || !location || !yearBuilt || !bedroom || !bathroom || !garadge) {
        return next(new AppError("Please fill in the required field", 400))
    } 

    const imageUrl = req.file ? req.file.cloudinaryUrl : null;
    //creating new property using the property model
        const newProperty = await Property.create({
            name,
            price,
            images: imageUrl ? [imageUrl] : [],
            map,
            location,
            amenities,
            exteriorFeatures,
            description,
            developmentStatus, 
            yearBuilt,
            bedroom,
            bathroom,
            garadge,
            status, 
            type
        });  

    //if successful returns a success message with the data of the new property
        return res.status(201).json({
            status: "success",
            message: 'Property successfully created',
            data: {
                newProperty 
            }
        });
});  

//FETCHING ALL THE PROPERTY DOCUMENT FROM DATABASE
exports.getAllProperty = catchAsync(async(req, res, next) => {
    const properties = await Property.find().populate("reviews");

    //SUCCESS RESPONSE
    res.status(200).json({
        status: 'success',
        message: 'succesfully fetched users',
        lenght : properties.length,
        data: { 
            properties
        }
    })
   
})


//UPDATING A PARTICULAR PROPERTY DOCUMENT 
exports.updateProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    //return an error message if there is no property with such id
    if (!property) {
    return next(new AppError("Property does not exist", 404))
    }
    //success response
    res.status(200).json({
        status: 'success',
        message: "property succesfully updated",
        data: {
            property
        }
    })

})

//FETCHING A SINGLE PROPERTY DOCUMENT FROM THE DATABASE USING ITS ID
exports.getAProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findById(req.params.id).populate("reviews");

    //success response
    res.status(200).json({
        status: 'success',
        message: "property fetched successful",
        data: {
            property
        }
    })
})

//DELETING A PROPERTY DOCUMENT FROM THE DATABASE USING ITS ID
exports.deleteAProperty = catchAsync(async (req, res, next) => {

    //FIND PROPERTY BY ID AND DELETE
    const property = await Property.findByIdAndDelete(req.params.id, req.body)

    //THE RESPONSE: THE PROPERTY IS SET TO NULL SINCE IT'S DELETED
    res.status(200).json({
        status: 'success',
        message: "user succesfully deleted",
        data: {
           property : null,
        }
    })
})


