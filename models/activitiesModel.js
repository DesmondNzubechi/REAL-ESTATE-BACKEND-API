const mongoose = require("mongoose");

const { Schema } = mongoose;

const activitiesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'activity must belong to a user']
    },
    property: {
        type: Schema.ObjectId,
        ref: "properties",
        required: [true, "activity must belong to a property"]
    },
    activityType: {
        type: String,
        enum: ['order_canceled', "order_approved", "order_rejected", "order_completed", "added_review"],
        required: [true, "activities must have type"]
    },
    Timestamp: {
        type: Date,
        default: Date.now()
    },
    order: {
        type: Schema.ObjectId,
        ref: "Order",
    },
    detail: {
        type: String,
        required: true
    }
})

const Activity = mongoose.model("Activities", activitiesSchema);

module.exports = Activity;