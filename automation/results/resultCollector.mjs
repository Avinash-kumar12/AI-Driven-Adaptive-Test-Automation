import { recordTestResult } from "./automation/results/result-collector.mjs";

recordTestResult({
    testId: "TC001",
    testName: "Healenium browser session",
    status: "passed",
    duration: 4.558,
    healed: false
});

recordTestResult({
    testId: "TC004",
    testName: "Automatic locator healing",
    status: "passed",
    duration: 13.032,
    healed: true,
    healingScore: 0.9091036414565826
});

console.log("Result collector test completed.");