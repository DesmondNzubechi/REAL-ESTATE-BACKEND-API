//REVIEW MODEL

const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, "please add a review"]
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
    }, 
    rating: { 
        type: Number,
        min: 1.5,
        max: 5.0,
        default: 2.0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    property: {
        type: mongoose.Schema.ObjectId,
        ref: "Property",
        required: [true, "review must belong to a property"]
    },
    reviewerName: {
        type: String,
        required: [true, "Reviewer must have a name"]
    }
})


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;