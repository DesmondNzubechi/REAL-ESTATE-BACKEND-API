const AppError = require("../errors/appError");
const Land = require("../models/landModel");
const catchAsync = require('../utils/catchAsync');


exports.createLand = catchAsync(async (req, res, next) => {
    const { name, location, map} = req.body
    
    if (!name || !location || !map) {
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
        images
    })

    res.status(201).json({
        status: "success",
        message: "land successfully created",
        data: {
            land : newLand
        }
    })
})