const express = require("express");

const predictions = require("../data/ai/predictions");

const router = express.Router();

router.get("/", (req, res) => {
    const sortedPredictions = [...predictions].sort(
        (a, b) => a.priority - b.priority
    );

    res.json(sortedPredictions);
});

module.exports = router;