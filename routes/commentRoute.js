const express = require("express");
const { createComment, getAllTheComment, deleteComment, updateComment } = require("../controllers/commentController");

const router = express.Router();


router
    .route("/createComment")
    .post(createComment)

    router
    .route("/getAllComment")
    .get(getAllTheComment)

    router
    .route("/getABlogComment/:commentId")
    .get(getAllTheComment)

    router
    .route("/deleteComment/:commentId")
    .delete(deleteComment)

    router
    .route("/updateComment:commentId")
    .patch(updateComment)

module.exports = router;
