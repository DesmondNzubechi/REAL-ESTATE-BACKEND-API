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
    photos: {
        type: [String],
        required: [true, 'property must have atlease one photo']
    },
    map: {
        type: String,
        required: [true, 'Please insert the location of the property']
    }
})


const Property = mongoose.model('properties', propertySchema);

module.exports = Property;