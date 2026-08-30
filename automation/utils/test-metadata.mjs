const testMetadata = new Map();

export function registerTestMetadata(testName, metadata) {
    testMetadata.set(testName, {
        ...metadata
    });
}

export function getTestMetadata(testName) {
    return testMetadata.get(testName) ?? {};
}