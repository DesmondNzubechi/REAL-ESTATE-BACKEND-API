const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'Please add comment']
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'comment must belong to a user']
    },
    blog: {
        type: Schema.ObjectId,
        ref: "Blog", 
        required: [true, "Comment must belong to a blog post"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
}
})


const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;