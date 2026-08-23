const express = require("express");

const { runSelectedTests } = require("../controller/adaptive-controller");

const router = express.Router();

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

module.exports = router;