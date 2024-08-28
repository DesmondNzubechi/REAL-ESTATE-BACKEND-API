const mongoose = require("mongoose");

const { Schema } = mongoose;

const activitiesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'Activity must belong to a user']
    },
    property: {
        type: Schema.ObjectId,
        ref: "properties" || "Blog"
    }, 
    activityType: {
        type: String,
        enum: ['order_canceled', 'order_approved', 'order_rejected', 'order_completed', 'order_placed', 'added_review', 'added_comment'],
        required: [true, "Activity must have a type"]
    },
    timestamp: {
        type: Date,
        default: Date.now
     },
});

const Activity = mongoose.model("Activity", activitiesSchema);

module.exports = Activity;
