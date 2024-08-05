const express = require("express");
const { createComment, getAllTheComment, deleteComment, updateComment, getAllTheBlogComment, getABlogComment } = require("../controllers/commentController");

const router = express.Router();


router
    .route("/createComment")
    .post(createComment)

    router
    .route("/getAllComment")
    .get(getAllTheBlogComment)

    router 
    .route("/getABlogComment/:blogId")
    .get(getABlogComment)

    router
    .route("/deleteComment/:commentId")
    .delete(deleteComment)

    router
    .route("/updateComment:commentId")
    .patch(updateComment)

module.exports = router;
