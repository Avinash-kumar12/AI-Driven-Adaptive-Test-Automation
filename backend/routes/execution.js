const express = require("express");

const {
    runSelectedTests,
    runSelectedTest
} = require("../controller/adaptive-controller");

const router = express.Router();

/*
 * Adaptive execution path.
 * Preserves the existing M2/prioritized-tests behavior.
 */
router.get("/", async (req, res) => {
    try {
        const results = await runSelectedTests();

        res.json({
            message: "Adaptive test execution completed",
            results
        });
    } catch (error) {
        res.status(500).json({
            message: "Adaptive test execution failed",
            error: error.message
        });
    }
});

/*
 * Selected Test Definition execution path.
 * Receives a concrete testId and executes the stored
 * Test Definition through the integrated M1 executor.
 */
router.post("/", async (req, res) => {
    try {
        const { testId } = req.body || {};

        if (
            typeof testId !== "string" ||
            testId.trim() === ""
        ) {
            return res.status(400).json({
                message: "testId is required"
            });
        }

        const result = await runSelectedTest(testId);

        return res.json({
            message: "Selected test execution completed",
            result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Selected test execution failed",
            error: error.message
        });
    }
});

module.exports = router;