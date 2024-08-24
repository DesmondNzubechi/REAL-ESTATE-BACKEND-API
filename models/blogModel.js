const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title require']
    },
    content: {
        type: String, 
        required: [true, 'blog contents is required']
    },
    slug: {
        type: String,
        required: [true, 'Please include the slug']
    },
    images: {
        type : String
    },
    comments: [
        {
            type: Schema.ObjectId,
            ref: "Comment"
        }
    ], 
    status: {
        type: String,
        enum: ["published", "unpublished"],
        default: 'unpublished'
    },
    date: {
        type: Date,
        default : Date.now
    },
    tag: {
        type: String,
        default: "News"
    }
})


const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;