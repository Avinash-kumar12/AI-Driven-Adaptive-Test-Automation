const express = require("express");

const executionHistory = require("../data/execution-history");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(executionHistory);
});

module.exports = router;