

//LAND CONTROLLER

const AppError = require("../errors/appError");
const Land = require("../models/landModel");
const catchAsync = require('../utils/catchAsync');

exports.createLand = catchAsync(async (req, res, next) => {
    const { name, location, map, description, price} = req.body
    
    if (!name || !location || !map || !description || !price) {
     return next(new AppError("Kindly input all the field", 400))  
    }

    if (!req.file) {
    return next(new AppError("Please upload image", 400))
    }
    
    const images = req.file.cloudinaryUrl

    const newLand = await Land.create({
        name,
        location,
        map,
        images : [images],
        description,
        price
    })

    res.status(201).json({
        status: "success",
        message: "land successfully created",
        data: {
            land : newLand
        }
    }) 
})



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
