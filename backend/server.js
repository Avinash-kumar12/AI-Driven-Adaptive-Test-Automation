const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const overviewRouter = require("./routes/overview");
const testsRouter = require("./routes/tests");
const riskRouter = require("./routes/risk");
const executionRouter = require("./routes/execution");
app.use("/api/overview", overviewRouter);
app.use("/api/tests", testsRouter);
app.use("/api/risk-ranking", riskRouter);
app.use("/api/execution", executionRouter);
app.get("/", (req, res) => {
    res.json({
        message: "AI-Driven Adaptive Test Automation Backend is running"
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});