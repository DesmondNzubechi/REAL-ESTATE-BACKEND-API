const express = require("express");
const { getAllActivities, getUserActivities } = require("../controllers/activitiesController");
const { protectedRoute } = require("../controllers/authController");

const router = express.Router();

router.use(protectedRoute);

router
    .route("/getAllActivities")
    .get(getAllActivities)

router
    .route('/getUserActivities/:user')
    .get(getUserActivities)

module.exports = router;