const express = require("express");
const { createComment, getAllTheComment, deleteComment, updateComment, getAllTheBlogComment, getABlogComment } = require("../controllers/commentController");

const router = express.Router();

//ROUTE FOR CREATING A COMMENT
router
    .route("/createComment")
    .post(createComment)

    //ROUTE FOR FETCHING ALL COMMENT
    router
    .route("/getAllComment")
    .get(getAllTheBlogComment)

    //ROUTE FOR FETCHING A PARTICULAR BLOG POST COMMENT
    router 
    .route("/getABlogComment/:blogId")
    .get(getABlogComment)

    //ROUTE FOR DELETING A COMMENT
    router
    .route("/deleteComment/:commentId")
    .delete(deleteComment)

    //ROUTE FOR EDITING A COMMENT
    router
    .route("/updateComment:commentId")
    .patch(updateComment)

module.exports = router;
