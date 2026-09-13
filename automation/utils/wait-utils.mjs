import { until } from "selenium-webdriver";

export async function waitForElement(driver, locator, timeout = 10000) {
    try {
        const element = await driver.wait(
            until.elementLocated(locator),
            timeout
        );

        return {
            element,
            command: "findElements"
        };
    } catch (error) {
        console.log("waitForElement failed:", error);

        try {
            const element = await driver.findElement(locator);

            return {
                element,
                command: "findElement"
            };
        } catch (fallbackError) {
            console.log("fallback findElement failed:", fallbackError);
            throw error;
        }
    }
}
