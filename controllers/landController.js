

//LAND CONTROLLER

const AppError = require("../errors/appError");
const Land = require("../models/landModel");
const catchAsync = require('../utils/catchAsync');


//MIDDLEWARE FOR CREATING LAND
exports.createLand = catchAsync(async (req, res, next) => {

    //EXPECTED INPUT FIELDS
    const { name, location, map, description, price} = req.body
    
    //RETURN ERROR MESSAGE IF ANY OF THE REQUIRED FIELD IS EMPTY
    if (!name || !location || !map || !description || !price) {
     return next(new AppError("Kindly input all the field", 400))  
    }


    //A LAND SHOULD BE LISTED WITH ATLEAST ONE IMAGE, IF THERE'S NO ONE ATTACHED RETURN AN ERROR MESSAGE
    if (!req.file) {
    return next(new AppError("Please upload image", 404))
    }
    
    //ASSIGN THE UPLOADED IMAGE URL TO IMAGES
    const images = req.file.cloudinaryUrl

    //CREATE LAND
    const newLand = await Land.create({
        name,
        location,
        map,
        images : [images],
        description,
        price
    })

    //SUCCESS RESPONSE
    res.status(201).json({
        status: "success",
        message: "land successfully created",
        data: {
            land : newLand
        }
    }) 
})


//MIDDLEWARE FOR FTECHING ALL LAND
exports.getAllLand = catchAsync(async (req, res, next) => {
    const allLand = await Land.find();

   return res.status(200).json({
        status: "success",
        message: "all land successfully fetched",
        data: {
            allLand
        }
    })
})

//MIDDLEWARE FOR FETCHING A LAND USING ITS ID
exports.getALand = catchAsync(async (req, res, next) => {
    
    const land = await Land.findById(req.params.id);

    return res.status(200).json({
        status: 'success',
        message: "land successfully fetched",
        data: {
            land
        }
    })

})


//MIDDLWARE FOR UPDATING LAND
exports.updateALand = catchAsync(async (req, res, next) => {
    const land = await Land.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true,

    })

    res.status(200).json({
        status: "success",
        message: "Land successfully updated",
        data: {
            land
        }
    })
})

//MIDDLEWARE FOR DELETING LAND
exports.deleteALand = catchAsync(async (req, res, next) => {
    const deletedLand = await Land.findByIdAndDelete(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        message: "land successfully deleted",
        data: {
            land : null
        }
    })
})
