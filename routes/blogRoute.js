const express = require("express");
const { createBlogPost, updateBlogPost, publishABlogPost, unPublishABlogPost, deleteBlogPost, getAllBlogPost, getABlogPost } = require("../controllers/blogController");
const { uploadPhoto, uploadImageToCloudinary } = require("../controllers/uploadController");

const router = express.Router();


//ROUTE FOR CREATING A BLOG POST
router
    .route("/createBlogPost")
    .post(uploadPhoto, uploadImageToCloudinary, createBlogPost)
 
    //ROUTE FOR FETCHING BLOG POST
    router
    .route("/getAllBlogPost")
    .get(getAllBlogPost)

    //ROUTE TO FETCH A BLOG POST USING ITS ID
    router
    .route("/getABlogPost/:id")
    .get(getABlogPost)


    //ROUTE TO UPDATE A BLOG POST
    router
    .route("/updateBlogPost/:id")
    .patch(updateBlogPost)

    //ROUTE TO PUBLISH A BLOG POST
    router
    .route("/publishBlogPost/:id")
    .patch(publishABlogPost)

    //ROUTE TO UNPUBLISH A BLOG POST
    router
    .route("/unpublishBlogPost/:id")
    .patch(unPublishABlogPost)

    //ROUTE TO DELETE A BLOG POST
    router
    .route("/deleteBlogPost/:id")
    .delete(deleteBlogPost)


module.exports = router;