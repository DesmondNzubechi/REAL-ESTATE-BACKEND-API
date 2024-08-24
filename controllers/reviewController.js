//REVIEW CONTROLLER

const Review = require('../models/reviewModel');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');
const { logActivitiesController } = require('./activitiesController');


exports.createAReview = catchAsync(async (req, res, next) => {
    const { review, property, rating, user } = req.body;

    if (!review || !property) {
        return next(new AppError("fields are required", 404))
    }

    const theReview = await Review.create({
        review,
        rating,
        property,
        user
    }) 

    const theProperty = await Property.findById(property);

    theProperty.reviews.push(theReview._id);

    await theProperty.save();

    try {
        logActivitiesController(
            user, // Pass the user ID directly
            property, // property id
            'added_review', // Activity type
        );
    } catch (err) {
        return next(new AppError('Failed to log activity', 500));
    }
 

    res.status(201).json({
        status: "success",
        message: "review succesfully added",
        data: {
            theReview
        }
    })


})

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find().populate('user');

  res.status(200).json({
        status: "success",
      message: "reviews succesfully fetched",
        length : reviews.length,
        data: {
            result : reviews
        }
    })
})

exports.getPropertyReview = catchAsync(async (req, res, next) => {
    const { property } = req.params
    
    const propertyReview = await Review.find({ property })
    
    res.status(200).json({
        status: "success",
        message: "property review succesfully fetched",
        length: propertyReview.length,
        data: { 
            result : propertyReview
        }
    })
})