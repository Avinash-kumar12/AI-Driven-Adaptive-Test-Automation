import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsFile = path.join(
    __dirname,
    "test-results.json"
);
export function analyzeResults() {
    if (!fs.existsSync(resultsFile)) {
        throw new Error("Test results file not found.");
    }

    const data = JSON.parse(
        fs.readFileSync(resultsFile, "utf8")
    );

    const tests = data.tests ?? [];

    const passed = tests.filter(
        test => test.status === "passed"
    ).length;

    const failed = tests.filter(
        test => test.status === "failed"
    ).length;

    const healed = tests.filter(
    test =>
        test.healingExpected === true &&
        test.healed === true
).length;

    const healingExpected = tests.filter(
        test => test.healingExpected === true
    ).length;

    const healingSuccessRate =
        healingExpected === 0
            ? 0
            : Number(
                ((healed / healingExpected) * 100).toFixed(2)
            );

    const failuresByModule = {};

    tests
        .filter(test => test.status === "failed")
        .forEach(test => {
            const module = test.module ?? "unknown";

            failuresByModule[module] =
                (failuresByModule[module] ?? 0) + 1;
        });

    const healingByLocatorType = {};

    tests
        .filter(
            test =>
                test.healingExpected === true &&
                test.locatorType
        )
        .forEach(test => {
            const locatorType = test.locatorType;

            if (!healingByLocatorType[locatorType]) {
                healingByLocatorType[locatorType] = {
                    attempts: 0,
                    healed: 0
                };
            }

            healingByLocatorType[locatorType].attempts++;

            if (test.healed === true) {
                healingByLocatorType[locatorType].healed++;
            }
        });

    return {
        totalExecutions: tests.length,
        passed,
        failed,
        healed,
        healingExpected,
        healingSuccessRate,
        averageDuration: data.avg_duration ?? 0,
        failuresByModule,
        healingByLocatorType,
        lastStatus: data.last_status ?? "not_run"
    };
}
