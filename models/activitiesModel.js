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
        ref: "Property"
    },
    activityType: {
        type: String,
        enum: ['canceled order', 'order_approved', 'order_rejected', 'order_completed', 'order_placed', 'added_review'],
        required: [true, "Activity must have a type"]
    },
    timestamp: {
        type: Date,
        default: Date.now
     },
    // activityModel: {
    //     type: String,
    //     enum: ["Review", "Order"],
    //     required: [true, 'Activity must have a model'],
    // },
    // detail: {
    //     type: String,
    //     required: [true, "Activity must have a detail"]
    // }
});

const Activity = mongoose.model("Activity", activitiesSchema);

module.exports = Activity;
