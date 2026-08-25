import { recordTestResult } from "../results/resultCollector.mjs";

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

            const healed =
                result.fullName
                    ?.toLowerCase()
                    .includes("heal");

            recordTestResult({
                testId: result.id,
                testName: result.fullName,
                status: failed ? "failed" : result.status,
                duration,
                healed,
                healingScore: null
            });

            startedAt.delete(result.id);
        },

        jasmineDone() {
            console.log(
                "Jasmine execution results collected successfully."
            );
        }
    };
}