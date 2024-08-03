const AppError = require("../errors/appError");
const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");





exports.createBlogPost = catchAsync(async (req, res, next) => {
    
    const { slug, title, contents } = req.body;

    if (!slug || !title || contents) {
        return next(new AppError("Please fill in the required field"))
    }

    const blog = await Blog.create({
        slug,
        title,
        contents
    })

    res.status(201).json({
        status: "success",
        message: "blog post successfuly created",
        data: {
            blog
        }
    })

})