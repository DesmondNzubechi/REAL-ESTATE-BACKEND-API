//REVIEW MODEL

const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, "please add a review"]
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
    }
})


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;