const AppError = require('../errors/appError');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');

exports.createProperty = catchAsync(async (req, res, next) => {
    console.log('Request Body:', req.body); // Log request body

    if (!req.body) {
        return next(new AppError('Request body is missing', 400));
    }


    const { name, price, photos, map, location } = req.body;


    if (!name || !price || !photos || !map || !location) {
        return next(new AppError("all field are required", 400))
    } 
    
        const newProperty = await Property.create({
            name,
            price,
            photos,
            map,
            location
        }); 

        console.log('New Property:', newProperty); // Log created property

        return res.status(201).json({
            status: "success",
            message: 'Property successfully created',
            data: {
                newProperty
            }
        });
});


exports.getAllProperty = catchAsync(async(req, res, next) => {
    const properties = await Property.find();

    res.status(200).json({
        status: 'success',
        message: 'succesfully fetched users',
        lenght : properties.length,
        data: {
            properties
        }
    })
   
})


