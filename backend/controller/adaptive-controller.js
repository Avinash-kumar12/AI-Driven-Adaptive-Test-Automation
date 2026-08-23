const predictions = require("../data/ai/predictions");
const { executeTest } = require("./mock-executor");

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
        results.push(result);
    }

    return results;
}

module.exports = {
    selectTests,
    runSelectedTests
};