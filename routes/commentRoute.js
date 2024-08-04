const express = require("express");
const { createComment } = require("../controllers/commentController");

const router = express.Router();


router
    .route("/createComment")
    .post(createComment)

module.exports = router;
