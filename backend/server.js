const express = require("express");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

const PORT = 3000;

app.use(express.json());

const overviewRouter = require("./routes/overview");
const testsRouter = require("./routes/tests");
const riskRouter = require("./routes/risk");
const executionRouter = require("./routes/execution");
const historyRouter = require("./routes/history");

app.use("/api/overview", overviewRouter);
app.use("/api/tests", testsRouter);
app.use("/api/risk-ranking", riskRouter);
app.use("/api/execution", executionRouter);
app.use("/api/history", historyRouter);

app.get("/", (req, res) => {
    res.json({
        message: "AI-Driven Adaptive Test Automation Backend is running"
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
