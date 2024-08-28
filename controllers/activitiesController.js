const Activity = require("../models/activitiesModel");
const catchAsync = require("../utils/catchAsync");

exports.logActivitiesController = catchAsync(async (user, property, activityType) => {
    
    const activityData = {
        user,
       property,
        activityType,
    };
 

    try {
        const newActivity = await Activity.create(activityData);
        console.log('Activity logged successfully:', newActivity); // Debugging
    } catch (error) {
        console.error('Error logging activity:', error); // Debugging
        throw new Error('Failed to log activity');
    }
});

exports.getAllActivities = catchAsync(async (req, res, next) => {
    const AllActivities = await Activity.find()
 
    res.status(200).json({
        status: "success",
        message: "activities succesfully fetched",
        data: {
activities: AllActivities 
        }
    })
})

exports.getUserActivities = catchAsync(async (req, res, next) => {
    
    const { user } = req.params;
 
    const userActivities = await Activity.find({ user }).populate("property");

    res.status(200).json({
        status: "success",
        message: "user activities successfully fetched",
        length: userActivities.length,
        data: {
            activities : userActivities
        }
    })

})