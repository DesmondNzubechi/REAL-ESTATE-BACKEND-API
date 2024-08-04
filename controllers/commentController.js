const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");



exports.createComment = catchAsync(async (req, res, next) => {

    const { comment, user, blog } = req.body;

    const findUser = await User.findById(user);
    const findBlog = await Blog.findById(blog);

    if (!findUser) {
        return next(new AppError("This user does not exist, try login before commenting", 400))
    }

    if (!findBlog) {
        return next(new AppError("Blog post does not exist", 400))
    }

    if (!comment || !user || !blog) {
    return next(new AppError("Please fill in the required field", 400))
}
    

    const theComment = await Comment.create({
        comment,
        user,
        blog
    })

    findBlog.comments.push(theComment._id);
    await findBlog.save();


    res.status(201).json({
        status: "success",
        message: "comment successful",
        data: {
            comment: theComment
        }
    })

})

exports.getAllTheComment = catchAsync(async (req, res, next) => {
    
    const allComment = await Comment.find().populate("user").populate("blog");

    res.status(200).json({
        status: "success",
        message: "comments fetch successful",
        length: allComment.length,
        data: {
            allComment
        }
    })
})