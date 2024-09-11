//REVIEW CONTROLLER

const Review = require('../models/reviewModel');
const Property = require('../models/propertyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../errors/appError');
const {promisify} = require('util')
const { propertyActivitiesController } = require('./activitiesController');
const jwt = require('jsonwebtoken');


//FOR CREATING A REVIEW
exports.createAReview = catchAsync(async (req, res, next) => {
    const { review, property, reviewerName } = req.body;

    const userToken = req.cookies.jwt;
 
    let theUserId;
    if (userToken) {
        const decodedToken = await promisify(jwt.verify)(userToken, process.env.JWT_SECRET);
        theUserId = decodedToken.id;
    }


    if (!review || !property || !reviewerName) {
        return next(new AppError("fields are required", 404))
    }
 
    const theReview = await Review.create({
        review,
        property, 
        user : theUserId, 
        reviewerName
    }) 

    const theProperty = await Property.findById(property);

    theProperty.reviews.push(theReview._id);

    await theProperty.save();
    
    if (userToken) { 
        try {
            propertyActivitiesController(
               theUserId, // Pass the user ID directly
                property, // property id
                'added_review', // Activity type
            );
        } catch (err) {
            return next(new AppError('Failed to log activity', 500));
        }  
    }

    res.status(201).json({
        status: "success",
        message: "review succesfully added",
        data: {
            theReview
        }
    })


})

//MIDDLEWARE FOR FETCHING ALL THE REVIEWS
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


//MIDDLEWARE FOR FETCHING A PROPERTY REVIEWS
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