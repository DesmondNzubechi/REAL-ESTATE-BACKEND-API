const express = require("express");
const { getAllActivities, getUserPropertyActivities, deleteAllTheactivities, getUserBlogActivities } = require("../controllers/activitiesController");
const { protectedRoute } = require("../controllers/authController");

const router = express.Router();

//make sure that only authenticated users can access this route
router.use(protectedRoute);

//get all activities
router
    .route("/getAllActivities")
    .get(getAllActivities)


    //get user activity(adding review or ordering for a property) using user's id
router
    .route('/getUserPropertyActivities/:user')
    .get(getUserPropertyActivities)

    //get user comment using jis/her id
    router
    .route('/getUserBlogActivities/:user')
    .get(getUserBlogActivities)
 
    //delet all activities
    router.delete('/deleteAllActivities', deleteAllTheactivities)

    //export the route
module.exports = router;