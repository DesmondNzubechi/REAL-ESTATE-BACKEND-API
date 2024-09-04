const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { blogActivitiesController } = require("./activitiesController");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");

//MIDDLEWARE FOR CREATING COMMENT
exports.createComment = catchAsync(async (req, res, next) => {

    const { comment, blog, username } = req.body;
 
    //FIND THE BLOG USING ITS ID(BLOG)
    const findBlog = await Blog.findById(blog);

    //RETURN ERROR MESSAGE IF THE BLOG DOES NOT EXIST
    if (!findBlog) {
        return next(new AppError("Blog post does not exist", 404))
    }

    //RETURN ERROR MESSAGE IF THE REQUIRRED FIELD ARE EMPTY
    if (!comment || !blog || !username) {
    return next(new AppError("Please fill in the required field", 400))
    }

    //CHECK THE JWT FROM THE COOKIE
    const userToken = req.cookies.jwt;

    //DEFINE USER VARIABLE
    let theUserId;

    //IF THE USER TOKEN IS AVAILABE THEN VERIFY IF IT'S CORRECT THEN EXTRACT THE USER ID FROM THE TOKEN AND ASIGN IT TO THE VARIABLE USERID
    if (userToken) {
      const  decodedToken = await promisify(jwt.verify)(userToken, process.env.JWT_SECRET);
        theUserId = decodedToken.id;
    }

    //FINALLY CREATE THE COMMENT
    const theComment = await Comment.create({
        comment,
        user : theUserId,
        blog,
        username 
    })

    //ADD THE ID OF THIS COMMENT TO THE BLOG'S COMMENT ARRAY
    findBlog.comments.push(theComment._id);
    await findBlog.save();


    //IF THE USER ID EXIST THEN LOG THE ACTIVITY TO THE USER'S ACTIVITIES
    if (theUserId) {
        try {
            blogActivitiesController(
                theUserId, // Pass the user ID directly
                blog, // blog id 
            );
        } catch (err) {
            return next(new AppError('Failed to log activity', 500));
        }
    }
    


//SUCCESS MESSAGE
    res.status(201).json({
        status: "success",
        message: "comment successful",
        data: {
            comment: theComment
        }
    })

})

//MIDDLEWARE FOR FETCHING ALL THE COMMENT
exports.getAllTheBlogComment = catchAsync(async (req, res, next) => {
    
    //FETCH ALL THE BLOG POST COMMENT POPULATING THE DETAILS OF THE USERS THAT MADE THE COMMENT AND THE BLOG IN WHICH THE COMMENT BELONG TO
    const allComment = await Comment.find().populate("user").populate("blog");

    //SUCCESS MESSAGE
    res.status(200).json({ 
        status: "success",
        message: "comments fetch successful",
        length: allComment.length,
        data: {
            allComment
        }
    })
})

//MIDDLEWARE FOR FETCHING COMMENT FOR A PARTICULAR BLOG POST USING ITS ID
exports.getABlogComment = catchAsync(async (req, res, next) => {

    const { blogId } = req.params;

    //FIND THE BLOG USING ITS ID
    const findBlog = await Blog.findById(blogId);

    //RETURN ERROR MESSAGE IF IT DOES NOT EXIST.
    if (!findBlog) {
        return next (new AppError("Blog does not exist anymore", 400))
    }
 
    //FIND THE BLOG COMMENT USING ITS ID
    const blogComment = await Comment.findOne({ blog: blogId }).populate("user");
 
    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: 'blog comment fetch successful',
        data: {
            comment: blogComment
        }
    })
})

//MIDDLEWARE FOR DELETING A COMMENT
    exports.deleteComment = catchAsync(async (req, res, next) => {

        //DESCTRUCTURE THE ID FROM THE URL PARAMETER
        const { commentId } = req.params;
        
        //DELETE THE COMMENT
        await Comment.findByIdAndDelete(commentId, req.body)

        //SUCCESS RESPONSE
        res.status(200).json({
            status: 'success',
            message: "comment deleted successfully",
            data: {data: null}
        })
    })


    //MIDDLEWARE FOR UPDATING COMMENT
exports.updateComment = catchAsync(async (req, res, next) => {
    

    const { commentId } = req.params;

    // UPDATE THE COMMENT USING ITS ID
    const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });

    if (!updatedComment) {
        return next(new AppError("Comment does not exist", 400))
    }

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "comment updated",
        data: {
            comment : updatedComment
        }
    })

    })
