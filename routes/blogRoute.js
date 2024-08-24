const express = require("express");
const { createBlogPost, updateBlogPost, publishABlogPost, unPublishABlogPost, deleteBlogPost, getAllBlogPost, getABlogPost } = require("../controllers/blogController");
const { uploadPhoto, uploadImageToCloudinary } = require("../controllers/uploadController");

const router = express.Router();


router
    .route("/createBlogPost")
    .post(uploadPhoto, uploadImageToCloudinary, createBlogPost)
 
    router
    .route("/getAllBlogPost")
    .get(getAllBlogPost)

    router
    .route("/getABlogPost/:id")
    .get(getABlogPost)


    router
    .route("/updateBlogPost/:id")
    .patch(updateBlogPost)

    router
    .route("/publishBlogPost/:id")
    .patch(publishABlogPost)

    router
    .route("/unpublishBlogPost/:id")
    .patch(unPublishABlogPost)

    router
    .route("/deleteBlogPost/:id")
    .delete(deleteBlogPost)


module.exports = router;