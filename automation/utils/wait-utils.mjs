import { until } from "selenium-webdriver";

export async function waitForElement(driver, locator, timeout = 10000) {
    try {
        return await driver.wait(
            until.elementLocated(locator),
            timeout
        );
    } catch (error) {
    console.log("waitForElement failed:", error);

    try {
        return await driver.findElement(locator);
    } catch (fallbackError) {
        console.log("fallback findElement failed:", fallbackError);
        throw error;
    }
}
}