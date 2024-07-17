const AppError = require('../errors/appError');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');

exports.createProperty = catchAsync(async (req, res, next) => {
    console.log('Request Body:', req.body); // Log request body

    if (!req.body) {
        return next(new AppError('Request body is missing', 400));
    }


    const { name, price, images, map, location, amenities, exteriorFeatures, description, developmentStatus } = req.body;


    if (!name || !price || !images || !map || !location) {
        return next(new AppError("all field are required", 400))
    } 
    
        const newProperty = await Property.create({
            name,
            price,
            images,
            map,
            location,
            amenities,
            exteriorFeatures,
            description,
            developmentStatus 
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


exports.updateProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    if (!property) {
    return next(new AppError("Property does not exist", 404))
}
    res.status(200).json({
        status: 'success',
        message: "property succesfully updated",
        data: {
            property
        }
    })

})

exports.getAProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findById(req.body.id);

    res.status(200).json({
        status: 'success',
        message: "property fetched successful",
        data: {
            property
        }
    })
})

exports.deleteAProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findByIdAndDelete(req.body.id)

    res.status(200).json({
        status: 'success',
        message: "user succesfully deleted",
        data: {
           property : null,
        }
    })
})


