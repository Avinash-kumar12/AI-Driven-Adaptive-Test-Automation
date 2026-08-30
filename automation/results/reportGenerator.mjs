import fs from "fs";
import path from "path";
import { analyzeResults } from "./resultAnalyzer.mjs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportFile = path.join(
    __dirname,
    "generated-report.json"
);

export function generateReport() {
    const analysis = analyzeResults();

    const report = {
        summary: {
            totalExecutions: analysis.totalExecutions,
            passed: analysis.passed,
            failed: analysis.failed,
            healed: analysis.healed,
            healingExpected: analysis.healingExpected,
            healingSuccessRate: analysis.healingSuccessRate,
            averageDuration: analysis.averageDuration,
            lastStatus: analysis.lastStatus
        },

        failuresByModule: analysis.failuresByModule,

        healingByLocatorType: analysis.healingByLocatorType
    };

    fs.writeFileSync(
        reportFile,
        JSON.stringify(report, null, 2)
    );

    return report;
}

console.log(
    JSON.stringify(generateReport(), null, 2)
);