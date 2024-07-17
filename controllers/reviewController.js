const Review = require('../models/reviewModel');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');


exports.createAReview = catchAsync(async (req, res, next) => {
    const { review, property, rating } = req.body;

    if (!review || !property) {
        return next(new AppError("fields are required", 404))
    }

    const theReview = await Review.create({
        review,
        rating,
        property
    })

    const theProperty = await Property.findById(property);

    theProperty.reviews.push(theReview._id);

    await theProperty.save();

    res.status(201).json({
        status: "success",
        message: "review succesfully added",
        data: {
            theReview
        }
    })


})