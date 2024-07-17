const mongoose = require("mongoose");

const { Schema } = mongoose;

const propertySchema = new Schema({
    name: {
        type: String,
        required : [true, 'please input property name']
    },
    price: {
        type: Number,
        required: [true, "please input the price"]
    },
    date: {
        type : Date
    },
    location: {
        type: String,
        required: [true, 'please insert the location of the property']
    },
    images: {
        type: [String],
        required: [true, 'property must have atlease one photo']
    },
    map: {
        type: String,
        required: [true, 'Please insert the location of the property']
    },
    description: {
        type: String,
        required: [true, "Please input description"]
    },
    developmentStatus: {
        type: String,
        required : [true, "Please input the development status"]
    },
    amenities: {
        type: String,
    },
    interiorFeatures: {
        type: String
    },
    exteriorFeatures: {
        type: String
    },
    reviews: [
        {
        type: mongoose.Schema.ObjectId,
        ref: "Review"
        }
    ]
})


const Property = mongoose.model('properties', propertySchema);

module.exports = Property;