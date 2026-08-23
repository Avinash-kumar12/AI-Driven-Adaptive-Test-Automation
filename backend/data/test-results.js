const testResults = [
    {
        testId: "TC001",
        testName: "Login Test",
        status: "passed",
        duration: 2.1,
        riskLevel: "LOW",
        healed: false
    },
    {
        testId: "TC002",
        testName: "Product Selection Test",
        status: "failed",
        duration: 3.8,
        riskLevel: "HIGH",
        healed: true
    },
    {
        testId: "TC003",
        testName: "Search Test",
        status: "passed",
        duration: 1.9,
        riskLevel: "LOW",
        healed: false
    },
    {
        testId: "TC004",
        testName: "Checkout Test",
        status: "failed",
        duration: 4.2,
        riskLevel: "HIGH",
        healed: false
    }
];

module.exports = testResults;