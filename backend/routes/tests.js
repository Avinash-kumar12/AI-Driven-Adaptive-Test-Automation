const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const RESULTS_PATH = path.resolve(
    __dirname,
    "../../automation/results/test-results.json"
);

router.get("/", (req, res) => {
    try {
        if (!fs.existsSync(RESULTS_PATH)) {
            return res.status(404).json({
                message: "Test results file not found"
            });
        }

        const data = JSON.parse(
            fs.readFileSync(RESULTS_PATH, "utf-8")
        );

        const latestByTestId = new Map();

        for (const result of data.tests ?? []) {
            latestByTestId.set(result.testId, result);
        }

        res.json([...latestByTestId.values()]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to load test results",
            error: error.message
        });
    }
});

module.exports = router;
