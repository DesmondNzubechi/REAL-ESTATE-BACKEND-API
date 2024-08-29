//PROPERTY MODEL

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
        type: Date,
        default : Date.now
    },
    location: {
        type: String,
        required: [true, 'please insert the location of the property']
    },
    images: {
        type: [String], 
        required: [true, 'Images is required']
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
    ],
    bathroom: {
        type: Number,
        required : [true, "Please add how many bathroom  is in the house"]
    },
    bedroom: {
        type: Number,
        required : [true, "Please add how many bedroom  is in the house"]
    },
    status: {
        type: String,
        required : [true, "Please add the status of the house"]
    },
    garadge: {
        type: Number,
        required : [true, "Please add how many parking space is in the house"]
    },
    yearBuilt: { 
        type: String,
        required: [true, "Please provide year the house was built"]
    }
})


const Property = mongoose.model('properties', propertySchema);

module.exports = Property;