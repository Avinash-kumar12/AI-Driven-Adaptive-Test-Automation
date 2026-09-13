const predictions = require("../data/ai/predictions");
const { executeTest } = require("./mock-executor");
const executionHistory = require("../data/execution-history");

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

        results.push(executionResult);

        executionHistory.push({
            ...executionResult,
            executedAt: new Date().toISOString()
        });
    }

    return results;
}

module.exports = {
    selectTests,
    runSelectedTests
};