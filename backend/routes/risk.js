const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const AI_OUTPUT_PATH = path.resolve(
    __dirname,
    "../../ai/data/processed/prioritized_tests.json"
);

router.get("/", (req, res) => {
    try {
        if (!fs.existsSync(AI_OUTPUT_PATH)) {
            return res.status(404).json({
                message: "AI prediction file not found"
            });
        }

        const data = JSON.parse(
            fs.readFileSync(AI_OUTPUT_PATH, "utf-8")
        );

        const sortedPredictions = [...(data.tests ?? [])].sort(
            (a, b) => a.priority - b.priority
        );

        res.json(sortedPredictions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to load AI predictions",
            error: error.message
        });
    }
});

module.exports = router;
