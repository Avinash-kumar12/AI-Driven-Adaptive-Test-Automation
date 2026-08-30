import { recordTestResult } from "../results/resultCollector.mjs";
import { getTestMetadata } from "../utils/test-metadata.mjs";
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

recordTestResult({
    testId: metadata.testId ?? result.id,
    testName: result.fullName,
    status: failed ? "failed" : result.status,
    duration,
    healed: healingState.healed,
    healingScore: healingState.healingScore,
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