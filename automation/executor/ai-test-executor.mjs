import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../..");

const AI_OUTPUT_PATH = path.join(
    PROJECT_ROOT,
    "ai",
    "data",
    "processed",
    "prioritized_tests.json"
);

const RUNNER_PATH = path.join(
    PROJECT_ROOT,
    "automation",
    "executor",
    "ai-jasmine-runner.mjs"
);

const TEST_REGISTRY = {
    "TC-HEAL-CONNECTION-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should create a browser session through Healenium"
    },

    "TC-HEAL-BASE-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should select an item using BasePage"
    },

    "TC-HEAL-BASE-002": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should verify element visibility using BasePage"
    },

    "TC-HEAL-ID-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should automatically heal a changed locator through Healenium"
    },

    "TC-HEAL-CSS-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should automatically heal a changed CSS locator through Healenium"
    },

    "TC-HEAL-XPATH-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should automatically heal a changed XPath locator through Healenium"
    },

    "TC-HEAL-CLASS-001": {
        file: "tests/basic/healenium-connection.spec.mjs",
        description: "should automatically heal a changed class locator through Healenium"
    },

    "TC-SMOKE-001": {
        file: "tests/basic/smoke.spec.mjs",
        description: "should execute successfully"
    }
};

export function loadPrioritizedTests() {
    if (!fs.existsSync(AI_OUTPUT_PATH)) {
        throw new Error(
            `AI prediction file not found: ${AI_OUTPUT_PATH}`
        );
    }

    const data = JSON.parse(
        fs.readFileSync(AI_OUTPUT_PATH, "utf-8")
    );

    return (data.tests ?? []).sort(
        (a, b) => a.priority - b.priority
    );
}

export function getPrioritizedTestIds() {
    return loadPrioritizedTests().map(
        test => test.test_id
    );
}

export function getTestDefinition(testId) {
    const definition = TEST_REGISTRY[testId];

    if (!definition) {
        throw new Error(
            `No test registry entry found for test ID: ${testId}`
        );
    }

    return definition;
}

function getLatestTestResult(testId) {
    const resultsPath = path.join(
        PROJECT_ROOT,
        "automation",
        "results",
        "test-results.json"
    );

    if (!fs.existsSync(resultsPath)) {
        return null;
    }

    const data = JSON.parse(
        fs.readFileSync(resultsPath, "utf-8")
    );

    const matchingResults = (data.tests ?? [])
        .filter(result => result.testId === testId)
        .sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        );

    return matchingResults[0] ?? null;
}




function runSingleTest(definition, testId) {
    return new Promise((resolve) => {
        const child = spawn(
            process.execPath,
            [
                RUNNER_PATH,
                definition.file,
                definition.description
            ],
            {
                cwd: PROJECT_ROOT,
                stdio: "inherit",
                env: process.env
            }
        );

        child.on("error", (error) => {
            console.error("Test process error:", error.message);
            resolve(false);
        });

        child.on("close", (code) => {
            const result = getLatestTestResult(testId);

            if (result) {
                resolve(result);
                return;
            }

            resolve({
                testId,
                status: code === 0 ? "passed" : "failed",
                duration: null,
                healed: false,
                healingScore: null
            });
        });
    });
}

export async function executePrioritizedTests() {
    const tests = loadPrioritizedTests();

    console.log("\nAI Prioritized Test Execution");
    console.log("================================");

    const executionSummary = [];

    for (const test of tests) {
        const definition = getTestDefinition(test.test_id);

        console.log(
            `\nPriority ${test.priority}: ${test.test_id}`
        );

        console.log(
            `Failure probability: ${(test.failure_probability * 100).toFixed(2)}%`
        );

        console.log(
            `Risk level: ${test.risk_level}`
        );

        console.log(
            `Executing: ${definition.description}`
        );

        try {
            const result = await runSingleTest(definition, testId);

            const status = result.status;

            executionSummary.push({
                testId: test.test_id,
                priority: test.priority,
                status
            });

            console.log(
                `Completed ${test.test_id}: ${status}`
            );
        } catch (error) {
            executionSummary.push({
                testId: test.test_id,
                priority: test.priority,
                status: "failed"
            });

            console.error(
                `Completed ${test.test_id}: failed`
            );

            console.error(error.message);
        }
    }

    console.log("\nAI Execution Summary");
    console.log("====================");

    for (const result of executionSummary) {
        console.log(
            `Priority ${result.priority}: ${result.testId} -> ${result.status}`
        );
    }

    return executionSummary;
}

export async function executeSingleTest(testId) {
    const definition = getTestDefinition(testId);

    console.log(
        `\nExecuting adaptive test: ${testId}`
    );

    return await runSingleTest(definition, testId);
}

export async function executeSelectedTests(testIds) {
    const executionSummary = [];

    for (const testId of testIds) {
        const definition = getTestDefinition(testId);

        console.log(
            `\nExecuting selected test: ${testId}`
        );

        try {
            const result = await runSingleTest(definition, testId);

            executionSummary.push(result);
        } catch (error) {
            executionSummary.push({
                testId,
                status: "failed",
                error: error.message
            });
        }
    }

    return executionSummary;
}
