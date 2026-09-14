const express = require("express");
const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    const history = db
        .prepare("SELECT * FROM execution_history ORDER BY id DESC")
        .all();

    res.json(history);
});

module.exports = router;