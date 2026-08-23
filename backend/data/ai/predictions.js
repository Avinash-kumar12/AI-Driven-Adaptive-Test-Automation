const predictions = [
    {
        testId: "TC002",
        failureProbability: 0.9995,
        riskLevel: "HIGH",
        prediction: 1,
        priority: 1
    },
    {
        testId: "TC004",
        failureProbability: 0.9603,
        riskLevel: "HIGH",
        prediction: 1,
        priority: 2
    },
    {
        testId: "TC001",
        failureProbability: 0.0001,
        riskLevel: "LOW",
        prediction: 0,
        priority: 3
    },
    {
        testId: "TC003",
        failureProbability: 0.0001,
        riskLevel: "LOW",
        prediction: 0,
        priority: 4
    }
];

module.exports = predictions;