const { createProperty, getAllProperty } = require("../controllers/propertyController");
const express = require('express');

const router = express.Router();

router.
    route('/createProperty')
    .post(createProperty);
    
    router.get("/", getAllProperty)


module.exports = router;
