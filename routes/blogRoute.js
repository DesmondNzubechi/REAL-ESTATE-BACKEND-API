const express = require("express");
const { createBlogPost } = require("../controllers/blogController");

const router = express.Router();


router
    .route("/createBlogPost")
    .post(createBlogPost)


module.exports = router;