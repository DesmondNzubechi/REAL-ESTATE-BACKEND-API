const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { logActivitiesController } = require("./activitiesController");



exports.createComment = catchAsync(async (req, res, next) => {

    const { comment, user, blog, username } = req.body;
 
    const findUser = await User.findById(user);
    const findBlog = await Blog.findById(blog);
 
    // if (!findUser) {
    //     return next(new AppError("This user does not exist, try login before commenting", 404))
    // } 

    if (!findBlog) {
        return next(new AppError("Blog post does not exist", 404))
    }

    if (!comment || !blog || !username) {
    return next(new AppError("Please fill in the required field", 400))
}
    

    const theComment = await Comment.create({
        comment,
        user,
        blog,
        username
    })

    findBlog.comments.push(theComment._id);
    await findBlog.save();

    if (findUser) {
        try {
            logActivitiesController(
                user, // Pass the user ID directly
                blog, // Use order._id for relatedId
                'added_comment', // Activity type
            );
        } catch (err) {
            return next(new AppError('Failed to log activity', 500));
        }
    }
    



    res.status(201).json({
        status: "success",
        message: "comment successful",
        data: {
            comment: theComment
        }
    })

})

exports.getAllTheBlogComment = catchAsync(async (req, res, next) => {
    
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

exports.getABlogComment = catchAsync(async (req, res, next) => {

    const { blogId } = req.params;

    const findBlog = await Blog.findById(blogId);

    if (!findBlog) {
        return next (new AppError("Blog does not exist anymore", 400))
    }
 
    const blogComment = await Comment.findOne({ blog: blogId }).populate("user");
 
    res.status(200).json({
        status: "success",
        message: 'blog comment fetch successful',
        data: {
            comment: blogComment
        }
    })
})

    exports.deleteComment = catchAsync(async (req, res, next) => {

        const { commentId } = req.params;
        
        const deleteComment = await Comment.findByIdAndDelete(commentId, req.body)

        res.status(200).json({
            status: 'success',
            message: "comment deleted successfully",
            data: {data: null}
        })
    })


exports.updateComment = catchAsync(async (req, res, next) => {
    
    const { commentId } = req.params;

    const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });

    if (!updatedComment) {
        return next(new AppError("Comment does not exist", 400))
    }

    res.status(200).json({
        status: "success",
        message: "comment updated",
        data: {
            comment : updatedComment
        }
    })

    })
