const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const db = require("../database");
const testDefinitions = require("../data/test-definitions");

const AI_OUTPUT_PATH = path.resolve(
    __dirname,
    "../../ai/data/adaptive/prioritized_tests.json"
);

async function loadExecutor() {
    const executorPath = path.resolve(
        __dirname,
        "../../automation/executor/ai-test-executor.mjs"
    );

    return await import(pathToFileURL(executorPath).href);
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

    return Array.isArray(data.tests) ? data.tests : [];
}

function selectTests() {
    return loadPredictions()
        .slice()
        .sort((a, b) => a.priority - b.priority);
}

function isCompleteTestDefinition(testDefinition) {
    return Boolean(
        testDefinition &&
        typeof testDefinition.testId === "string" &&
        testDefinition.testId.trim() !== "" &&
        typeof testDefinition.name === "string" &&
        testDefinition.name.trim() !== "" &&
        typeof testDefinition.targetUrl === "string" &&
        testDefinition.targetUrl.trim() !== "" &&
        typeof testDefinition.description === "string" &&
        Array.isArray(testDefinition.steps) &&
        testDefinition.steps.length > 0
    );
}

/*
 * Adaptive execution path.
 *
 * M2 prioritized output
 * -> resolve Test Definition
 * -> M1 dynamic executor
 * -> SQLite history
 *
 * Missing Test Definitions are reported without invoking M1.
 */
async function runSelectedTests() {
    const selectedTests = selectTests();

    if (selectedTests.length === 0) {
        return [];
    }

    const executor = await loadExecutor();
    const results = [];

    for (const prediction of selectedTests) {
        const testId = prediction.test_id;

        const testDefinition = testDefinitions.find(
            (test) => test.testId === testId
        );

        if (!isCompleteTestDefinition(testDefinition)) {
            results.push({
                testId,
                status: "unresolved",
                message:
                    `Test Definition not found or incomplete for adaptive execution: ${testId}`,
                failureProbability:
                    prediction.failure_probability,
                riskLevel:
                    prediction.risk_level,
                prediction:
                    prediction.prediction,
                priority:
                    prediction.priority
            });

            continue;
        }

        const executionResult =
            await executor.executeDynamicTest(testDefinition);

        const result = {
            testId: executionResult.testId,
            status: executionResult.status,
            duration: executionResult.duration,
            healed: executionResult.healed,
            healingScore: executionResult.healingScore,
            timestamp: executionResult.timestamp,
            message:
                executionResult.error ??
                `Adaptive test execution completed with status: ${executionResult.status}`,
            failureProbability:
                prediction.failure_probability,
            riskLevel:
                prediction.risk_level,
            prediction:
                prediction.prediction,
            priority:
                prediction.priority
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

/*
 * Selected Test Definition execution path.
 *
 * Test Definition -> M1 dynamic executor -> Selenium -> result -> SQLite
 *
 * This path intentionally does NOT depend on M2 prioritized_tests.json.
 */
async function runSelectedTest(testId) {
    const testDefinition = testDefinitions.find(
        (test) => test.testId === testId
    );

    if (!testDefinition) {
        throw new Error(
            `Test definition not found: ${testId}`
        );
    }

    const { executeDynamicTest } = await loadExecutor();

    const executionResult =
        await executeDynamicTest(testDefinition);

    const result = {
        ...executionResult,
        message:
            executionResult.error ??
            `Selected test execution completed with status: ${executionResult.status}`
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
        null,
        null,
        null,
        null,
        new Date().toISOString(),
        result.timestamp
    );

    return result;
}

module.exports = {
    selectTests,
    runSelectedTests,
    runSelectedTest
};