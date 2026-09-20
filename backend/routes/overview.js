const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const RESULTS_PATH = path.resolve(
    __dirname,
    "../../automation/results/test-results.json"
);

const AI_OUTPUT_PATH = path.resolve(
    __dirname,
    "../../ai/data/processed/prioritized_tests.json"
);

router.get("/", (req, res) => {
    try {
        if (!fs.existsSync(RESULTS_PATH)) {
            return res.status(404).json({
                message: "Test results file not found"
            });
        }

        const resultsData = JSON.parse(
            fs.readFileSync(RESULTS_PATH, "utf-8")
        );

        const latestByTestId = new Map();

        for (const result of resultsData.tests ?? []) {
            latestByTestId.set(result.testId, result);
        }

        const latestResults = [...latestByTestId.values()];

        let highRisk = 0;

        if (fs.existsSync(AI_OUTPUT_PATH)) {
            const aiData = JSON.parse(
                fs.readFileSync(AI_OUTPUT_PATH, "utf-8")
            );

            highRisk = (aiData.tests ?? []).filter(
                (test) => test.risk_level === "HIGH"
            ).length;
        }

        res.json({
            totalTests: latestResults.length,
            passed: latestResults.filter(
                (test) => test.status === "passed"
            ).length,
            failed: latestResults.filter(
                (test) => test.status === "failed"
            ).length,
            healed: latestResults.filter(
                (test) => test.healed === true
            ).length,
            highRisk
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load overview",
            error: error.message
        });
    }
});

module.exports = router;
