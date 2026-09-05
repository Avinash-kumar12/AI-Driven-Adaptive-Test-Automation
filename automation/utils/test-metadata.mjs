const testMetadata = new Map();

export function registerTestMetadata(testName, metadata) {
    testMetadata.set(testName, {
        ...metadata
    });
}

export function getTestMetadata(testName) {
    const exactMatch = testMetadata.get(testName);

    if (exactMatch) {
        return exactMatch;
    }

    const normalizedName = testName?.trim().replace(/\s+/g, " ");

    if (!normalizedName) {
        return {};
    }

    for (const [registeredName, metadata] of testMetadata.entries()) {
        const normalizedRegisteredName =
            registeredName.trim().replace(/\s+/g, " ");

        if (normalizedRegisteredName === normalizedName) {
            return metadata;
        }
    }

    return {};
}