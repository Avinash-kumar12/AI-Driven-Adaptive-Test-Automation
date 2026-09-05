import { recordTestResult } from "../results/resultCollector.mjs";
import { getTestMetadata } from "../utils/test-metadata.mjs";
import { getLatestHealingScore } from "../utils/healing-score-resolver.mjs";
import {
    getHealingState,
    resetHealingState
} from "../utils/healing-context.mjs";
export function createResultReporter() {
    const startedAt = new Map();

    return {
        jasmineStarted() {
            // Reporter initialization hook
        },

        specStarted(result) {
            startedAt.set(result.id, Date.now());
        },

        async specDone(result) {
            const start = startedAt.get(result.id) ?? Date.now();
            const duration = (Date.now() - start) / 1000;

            const failed =
                result.status === "failed" ||
                result.failedExpectations?.length > 0;

            const healingState = getHealingState();
            const metadata = getTestMetadata(result.fullName);
            

let healingScore = healingState.healingScore;

if (healingState.healed && metadata.locator) {
    try {
        const url = metadata.url;
        healingScore = await getLatestHealingScore({
            locator: metadata.locator,
            command: metadata.locatorType === "xpath"
                ? "findElements"
                : "findElement",
            url
        });
    } catch (error) {
        console.log("Healing score lookup failed:", error);
    }
}


recordTestResult({
    testId: metadata.testId ?? result.id,
    testName: result.fullName,
    status: failed ? "failed" : result.status,
    duration,
    healed: healingState.healed,
    healingScore:healingScore,
    module: metadata.module ?? null,
    scenario: metadata.scenario ?? null,
    locatorType: metadata.locatorType ?? null,
    healingExpected: metadata.healingExpected ?? false
});
resetHealingState();
            startedAt.delete(result.id);
        },

        jasmineDone() {
            console.log(
                "Jasmine execution results collected successfully."
            );
        }
    };
}