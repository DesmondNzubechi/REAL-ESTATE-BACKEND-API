const express = require("express");
const { createBlogPost, updateBlogPost, publishABlogPost, unPublishABlogPost, deleteBlogPost, getAllBlogPost, getABlogPost } = require("../controllers/blogController");

const router = express.Router();


router
    .route("/createBlogPost")
    .post(createBlogPost)

module.exports = router;