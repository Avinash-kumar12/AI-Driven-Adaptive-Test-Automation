const predictions = require("../data/ai/predictions");
const { executeTest } = require("./mock-executor");
const db = require("../database");

function selectTests() {
    return predictions
        .filter((test) => test.riskLevel === "HIGH")
        .sort((a, b) => a.priority - b.priority);
}

async function runSelectedTests() {
    const selectedTests = selectTests();

    const results = [];

    for (const test of selectedTests) {
        const result = await executeTest(test);

        const executionResult = {
            ...result,
            failureProbability: test.failureProbability,
            riskLevel: test.riskLevel,
            prediction: test.prediction,
            priority: test.priority
        };

        db.prepare(`
            INSERT INTO execution_history (
                testId,
                status,
                duration,
                healed,
                message,
                failureProbability,
                riskLevel,
                prediction,
                priority,
                executedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            executionResult.testId,
            executionResult.status,
            executionResult.duration,
            executionResult.healed ? 1 : 0,
            executionResult.message,
            executionResult.failureProbability,
            executionResult.riskLevel,
            executionResult.prediction,
            executionResult.priority,
            new Date().toISOString()
        );

        results.push(executionResult);
    }

    return results;
}

module.exports = {
    selectTests,
    runSelectedTests
};