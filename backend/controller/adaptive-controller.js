const fs = require("fs");
const path = require("path");
const db = require("../database");

const AI_OUTPUT_PATH = path.resolve(
    __dirname,
    "../../ai/data/processed/prioritized_tests.json"
);

async function loadExecutor() {
    const executorPath = path.resolve(
        __dirname,
        "../../automation/executor/ai-test-executor.mjs"
    );

    return await import(executorPath);
}

function loadPredictions() {
    if (!fs.existsSync(AI_OUTPUT_PATH)) {
        throw new Error(
            `AI prediction file not found: ${AI_OUTPUT_PATH}`
        );
    }

    const data = JSON.parse(
        fs.readFileSync(AI_OUTPUT_PATH, "utf-8")
    );

    return data.tests ?? [];
}

function selectTests() {
    return loadPredictions()
        .filter((test) => test.risk_level === "HIGH")
        .sort((a, b) => a.priority - b.priority);
}

async function runSelectedTests() {
    const selectedTests = selectTests();

    if (selectedTests.length === 0) {
        return [];
    }

    const selectedIds = selectedTests.map(
        (test) => test.test_id
    );

    const { executeSelectedTests } = await loadExecutor();

    const executionResults =
        await executeSelectedTests(selectedIds);

    const predictionById = new Map(
        selectedTests.map((test) => [
            test.test_id,
            test
        ])
    );

    const results = [];

    for (const executionResult of executionResults) {
        const prediction = predictionById.get(
            executionResult.testId
        );

        if (!prediction) {
            continue;
        }

        const result = {
            ...executionResult,
            duration: executionResult.duration,
            healed: executionResult.healed,
            healingScore: executionResult.healingScore,
            timestamp: executionResult.timestamp,
            message:
                executionResult.error ??
                `Selected test execution completed with status: ${executionResult.status}`,
            failureProbability:
                prediction.failure_probability,
            riskLevel: prediction.risk_level,
            prediction: prediction.prediction,
            priority: prediction.priority
        };

        db.prepare(`
            INSERT INTO execution_history (
                testId,
                status,
                duration,
                healed,
                healingScore,
                message,
                failureProbability,
                riskLevel,
                prediction,
                priority,
                executedAt,
                timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            result.testId,
            result.status,
            result.duration,
            result.healed ? 1 : 0,
            result.healingScore,
            result.message,
            result.failureProbability,
            result.riskLevel,
            result.prediction,
            result.priority,
            new Date().toISOString(),
            result.timestamp
        );

        results.push(result);
    }

    return results;
}

module.exports = {
    selectTests,
    runSelectedTests
};