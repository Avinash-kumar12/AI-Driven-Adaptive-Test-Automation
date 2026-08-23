const express = require("express");

const testResults = require("../data/test-results");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(testResults);
});

module.exports = router;