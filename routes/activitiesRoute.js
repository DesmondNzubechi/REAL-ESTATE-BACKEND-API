const express = require("express");
const { getAllActivities } = require("../controllers/activitiesController");

const router = express.Router();


router.route("/getAllActivities").get(getAllActivities)

module.exports = router;