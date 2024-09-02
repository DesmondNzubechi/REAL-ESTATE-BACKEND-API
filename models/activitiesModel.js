const mongoose = require("mongoose");

const { Schema } = mongoose;

const propertyActivitiesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'Activity must belong to a user']
    },
    property: {
        type: Schema.ObjectId,
        ref: "properties"
 },
    activityType: {
        type: String,
        enum: ['order_canceled', 'order_approved', 'order_rejected', 'order_completed', 'order_placed', 'added_review'],
        required: [true, "Activity must have a type"]
    }, 
    timestamp: {
        type: Date,
        default: Date.now
     },
});


const blogActivitiesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'Activity must belong to a user']
    },
    blog: {
        type: Schema.ObjectId,
        ref: "Blog"
 },
    activityType: {
        type: String,
        default : "added_comment"
    }, 
    timestamp: {
        type: Date,
        default: Date.now
     },
})



const propertyActivity = mongoose.model("propertyActivity", propertyActivitiesSchema);
const blogActivity = mongoose.model("blogActivities", blogActivitiesSchema)

module.exports = {propertyActivity, blogActivity};

