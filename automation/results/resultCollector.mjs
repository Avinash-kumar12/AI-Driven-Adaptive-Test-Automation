import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsDir = __dirname;

const resultsFile = path.join(
    resultsDir,
    "test-results.json"
);
function ensureResultsFile() {
    fs.mkdirSync(resultsDir, { recursive: true });

    if (!fs.existsSync(resultsFile)) {
        fs.writeFileSync(
            resultsFile,
            JSON.stringify(
                {
                    execution_count: 0,
                    failure_count: 0,
                    recent_failures: [],
                    healed_count: 0,
                    avg_duration: 0,
                    last_status: "not_run",
                    tests: []
                },
                null,
                2
            )
        );
    }
}

export function recordTestResult({
    testId,
    testName,
    status,
    duration,
    healed = false,
    healingScore = null,
module = null,
scenario = null,
locatorType = null,
healingExpected = false
}) {
    ensureResultsFile();

    const data = JSON.parse(
        fs.readFileSync(resultsFile, "utf8")
    );

    const result = {
    testId,
    testName,
    status,
    duration: Number(duration.toFixed(3)),
    healed,
    healingScore,
    module,
    scenario,
    locatorType,
    healingExpected,
    timestamp: new Date().toISOString()
};
    data.execution_count++;

    if (status === "failed") {
        data.failure_count++;

        data.recent_failures.push({
            testId,
            testName,
            timestamp: result.timestamp
        });

        data.recent_failures =
            data.recent_failures.slice(-10);
    }

    if (healed) {
        data.healed_count++;
    }

    data.tests.push(result);

    const totalDuration = data.tests.reduce(
        (sum, test) => sum + test.duration,
        0
    );

    data.avg_duration = Number(
        (totalDuration / data.tests.length).toFixed(3)
    );

    data.last_status = status;

    fs.writeFileSync(
        resultsFile,
        JSON.stringify(data, null, 2)
    );
}