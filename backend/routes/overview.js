const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        totalTests: 4,
        passed: 2,
        failed: 2,
        healed: 1,
        highRisk: 2
    });
});

module.exports = router;