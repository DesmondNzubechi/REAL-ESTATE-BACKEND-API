const mongoose = require("mongoose");

const { Schema } = mongoose;

const landSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please input the land name"]
    },
    location: {
        type: String,
        required: [true, 'Please input the land location']
    },
    map: {
        type: String,
        required: [true, "Please input the map url"]
    },
    images: {
        type: String,
        require: [true, "Image is required"]
    }
})

const Land = mongoose.model("land", landSchema);

module.exports = Land;