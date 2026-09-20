const express = require("express");

const testResults = require("../data/test-results");
const testDefinitions = require("../data/test-definitions");

const router = express.Router();

const SUPPORTED_ACTIONS = new Set([
    "OPEN",
    "TYPE",
    "CLICK",
    "VERIFY"
]);

const SUPPORTED_LOCATOR_TYPES = new Set([
    "id",
    "css",
    "xpath",
    "name",
    "className"
]);

function validateTestDefinition(body) {
    const {
        testId,
        name,
        targetUrl,
        description,
        steps
    } = body || {};

    if (
        typeof testId !== "string" ||
        testId.trim() === ""
    ) {
        return "testId is required";
    }

    if (
        typeof name !== "string" ||
        name.trim() === ""
    ) {
        return "name is required";
    }

    if (
        typeof targetUrl !== "string" ||
        targetUrl.trim() === ""
    ) {
        return "targetUrl is required";
    }

    if (
        typeof description !== "string"
    ) {
        return "description must be a string";
    }

    if (!Array.isArray(steps) || steps.length === 0) {
        return "steps must be a non-empty array";
    }

    for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index];

        if (!step || typeof step !== "object") {
            return `steps[${index}] must be an object`;
        }

        if (!SUPPORTED_ACTIONS.has(step.action)) {
            return `steps[${index}].action must be one of OPEN, TYPE, CLICK, VERIFY`;
        }

        if (
            step.locatorType !== null &&
            !SUPPORTED_LOCATOR_TYPES.has(step.locatorType)
        ) {
            return `steps[${index}].locatorType is invalid`;
        }

        if (
            step.locator !== null &&
            typeof step.locator !== "string"
        ) {
            return `steps[${index}].locator must be a string or null`;
        }

        if (
            step.value !== null &&
            typeof step.value !== "string"
        ) {
            return `steps[${index}].value must be a string or null`;
        }

        if (step.action === "OPEN") {
            if (
                step.locatorType !== null ||
                step.locator !== null
            ) {
                return `steps[${index}] OPEN must have locatorType and locator as null`;
            }
        }

        if (
            ["TYPE", "CLICK", "VERIFY"].includes(step.action) &&
            (
                !step.locatorType ||
                !step.locator
            )
        ) {
            return `steps[${index}] ${step.action} requires locatorType and locator`;
        }
    }

    return null;
}

/*
 * Existing endpoint.
 * Keep the current dashboard/test-result behavior intact.
 */
router.get("/", (req, res) => {
    res.json(testResults);
});

/*
 * Test Definition creation endpoint.
 */
router.post("/", (req, res) => {
    const validationError = validateTestDefinition(req.body);

    if (validationError) {
        return res.status(400).json({
            message: "Invalid test definition",
            error: validationError
        });
    }

    const {
        testId,
        name,
        targetUrl,
        description,
        steps
    } = req.body;

    const existingTest = testDefinitions.find(
        (test) => test.testId === testId
    );

    if (existingTest) {
        return res.status(409).json({
            message: "Test definition already exists",
            error: `Test ID ${testId} already exists`
        });
    }

    const testDefinition = {
        testId,
        name,
        targetUrl,
        description,
        steps
    };

    testDefinitions.push(testDefinition);

    return res.status(201).json(testDefinition);
});

module.exports = router;