const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");


exports.createBlogPost = catchAsync(async (req, res, next) => {
    
    const { slug, title, content } = req.body;

    if (!slug || !title || !content) {
        return next(new AppError("Please fill in the required field"))
    }


    const imageUrl = req.file ? req.file.cloudinaryUrl : '';

    const blog = await Blog.create({
        slug,
        title,
        content,
        images: imageUrl
    })

    res.status(201).json({
        status: "success",
        message: "blog post successfuly created",
        data: {
            blog
        }
    })

})


exports.getAllBlogPost = catchAsync(async (req, res, next) => {
    
    const allTheBlogPost = await Blog.find().populate("comments");

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
    
    const { id } = req.params;

    const blogPost = await Blog.findById(id);


    if (!blogPost) {
        
        return next(new AppError("Blog post not found", 400))
    }

    res.status(200).json({
        status: "success",
        message: "blog post fetch succcessful",
        data: {
            blogPost
        }
    })
})

exports.getPublishedBlogPosts = catchAsync(async (req, res, next) => {
    
    const publishedPost = await Blog.find({ status: 'published' });

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

    const blogPost = await Blog.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 404))
    }

    res.status(200).json({
        status: "success",
        message: "Blog post successfully updated",
        data: {
            blogPost
        }
    })

})

exports.publishABlogPost = catchAsync(async (req, res, next) => {
    
    const { id } = req.params;
    
    const blogPost = await Blog.findByIdAndUpdate(id, { status: "published" }, { new: true });

    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 404));
    }

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
    
    const blogPost = await Blog.findByIdAndUpdate(id, { status: "unpublished" }, { new: true });

    if (!blogPost) {
        return next(new AppError("This blog post does not exist", 400));
    }

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

    const deleteBlogPost = await Blog.findByIdAndDelete(id, req.body);

    res.status(200).json({
        status: "success",
        message: "blog post deleted successfully",
        data: {
           data: null
        }
    })
})