const {propertyActivity, blogActivity} = require('../models/activitiesModel')
const catchAsync = require("../utils/catchAsync");


//PROPERTY ACTIVITY CONTROLLER
exports.propertyActivitiesController = catchAsync(async (user, property, activityType) => {
    
    const activityData = {
        user,
       property,
        activityType,
    };
 
 
    try {
        const newActivity = await propertyActivity.create(activityData)
        console.log('Activity logged successfully:', newActivity); // Debugging
    } catch (error) {
        console.error('Error logging activity:', error); // Debugging
        throw new Error('Failed to log activity');
    }
}); 


//BLOG ACTIVITY CONTROLLER
exports.blogActivitiesController = catchAsync(async (user, blog) => {
    
    const activityData = {
        user,
      blog
    };
 
  
    try {
        const newActivity = await blogActivity.create(activityData)
    } catch (error) {
        throw new Error('Failed to log activity');
    }
}); 


exports.getAllActivities = catchAsync(async (req, res, next) => {
    const AllActivities = await propertyActivity.find()
 
    res.status(200).json({
        status: "success",
        message: "activities succesfully fetched",
        data: {
activities: AllActivities 
        }
    })
})
 
exports.getUserPropertyActivities = catchAsync(async (req, res, next) => {
    
    const { user } = req.params;
 
    const userActivities = await propertyActivity.find({ user }).populate("property");

 
    res.status(200).json({
        status: "success",
        message: "user activities successfully fetched",
        length: userActivities.length,
        data: {
            activities : userActivities
        }
    }) 

})

exports.getUserBlogActivities = catchAsync(async (req, res, next) => {
    
    const { user } = req.params;
 
    const userActivities = await blogActivity.find({ user }).populate("blog");

 
    res.status(200).json({
        status: "success",
        message: "user activities successfully fetched",
        length: userActivities.length,
        data: {
            activities : userActivities
        }
    }) 

})

exports.deleteAllTheactivities = catchAsync(async (req, res, next) => {
    
    await propertyActivity.deleteMany();

    res.status(200).json({
        status: "successful",
        message: 'all activities successfully deleted'
    })

})