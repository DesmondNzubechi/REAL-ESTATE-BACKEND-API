const express = require("express");
const { getAllActivities, getUserPropertyActivities, deleteAllTheactivities, getUserBlogActivities } = require("../controllers/activitiesController");
const { protectedRoute } = require("../controllers/authController");

const router = express.Router();

router.use(protectedRoute);

router
    .route("/getAllActivities")
    .get(getAllActivities)

router
    .route('/getUserPropertyActivities/:user')
    .get(getUserPropertyActivities)

    router
    .route('/getUserBlogActivities/:user')
    .get(getUserBlogActivities)
 
    router.delete('/deleteAllActivities', deleteAllTheactivities)
module.exports = router;