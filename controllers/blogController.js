const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");

exports.createBlogPost = catchAsync(async (req, res, next) => {
    
    const { slug, title, content, theTag } = req.body;

    //RETURN AN ERROR MESSAGE IF THE REQUIRED FIELD ARE NOT PROVIDED
    if (!slug || !title || !content) {
        return next(new AppError("Please fill in the required field"))
    }


    //IF THERE IS A FILE ASSIGN IT TO THIS VARIABLE ELSE ASSIGN EMPTY STRING
    const imageUrl = req.file ? req.file.cloudinaryUrl : '';

    //CREATE BLOG POST
    const blog = await Blog.create({
        slug, 
        title,
        content,
        images: imageUrl,
        theTag
    })

    //SUCCESS MESSAGE
    res.status(201).json({
        status: "success",
        message: "blog post successfuly created",
        data: {
            blog
        }
    })

})


exports.getAllBlogPost = catchAsync(async (req, res, next) => {
    
    //FETCH ALL THE BLOG POST WITH THEIR COMMENT
    const allTheBlogPost = await Blog.find().populate("comments");

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "Blog post successfully fetched",
        length: allTheBlogPost.length,
        data: {
            blogPost : allTheBlogPost
        }
    })
})

exports.getABlogPost = catchAsync(async (req, res, next) => {

    //DESTRUCTURE THE ID OF A BLOG FROM THE URL PARAMETER
    const { id } = req.params;

    //FIND BLOG POST BY ID AND POPULATE UITS COMMENT
    const blogPost = await Blog.findById(id).populate('comments');


    //IF BLOG DOES NOT EXIST WITH SUCH ID RETURN AN ERROR MESSAGE
    if (!blogPost) {
        
        return next(new AppError("Blog post not found", 404))
    }

    //IF EVERYTHING IS OKAY RETURN A SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "blog post fetch succcessful",
        data: {
            blogPost
        }
    })
})


exports.getPublishedBlogPosts = catchAsync(async (req, res, next) => {
    
    //FIND BLOG WITH "PUBLISHED" STATUS, THESE ARE THE BLOG THAT ARE DISPLAYED TO THE USERS
    const publishedPost = await Blog.find({ status: 'published' });

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "Blog post fetched successful",
        length: publishedPost.length,
        data: {
            publishedPost
        }
    })
})


exports.updateBlogPost = catchAsync(async (req, res, next) => {

    const {id} = req.params

    //UPDATE A BLOG POST USING ITS ID
    const blogPost = await Blog.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    //IF THERE IS NO BLOG WITH SUCH ID RETURN ERROR MESSAGE
    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 404))
    }

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "Blog post successfully updated",
        data: {
            blogPost
        }
    })

})

//MIDDLEWARE FOR PUBLISHING OF BLOG POST
exports.publishABlogPost = catchAsync(async (req, res, next) => {
    
    const { id } = req.params;

    //FIND A BLOG POST USING THE PROVIDED ID AND UPDATE ITS STATUS TO PUBLISHED SO THAT WAY USERS CAN SEE IT
    const blogPost = await Blog.findByIdAndUpdate(id, { status: "published" }, { new: true });

    //IF THERE IS NO BLOG WITH SUCH ID RETURN ERROR MESSAGE
    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 404));
    }
//SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "blog post successfully published",
        data: {
            blogPost
        }
    })
})


exports.unPublishABlogPost = catchAsync(async (req, res, next) => {
    
    const { id } = req.params;
     //FIND A BLOG POST USING THE PROVIDED ID AND UPDATE ITS STATUS TO "UNPUBLISHED" SO THAT WAY ONLY THE ADMIN CAN SEE IT
    const blogPost = await Blog.findByIdAndUpdate(id, { status: "unpublished" }, { new: true });

    //IF THERE IS NO BLOG WITH SUCH ID RETURN ERROR MESSAGE
    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 404));
    }

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "blog post successfully unpublished",
        data: {
            blogPost
        }
    })
})

exports.deleteBlogPost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
//FIND A BLOG POST BY ITS ID AND DELETE IT
    await Blog.findByIdAndDelete(id, req.body);

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "blog post deleted successfully",
        data: {
           data: null
        }
    })
})