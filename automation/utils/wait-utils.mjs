import { until } from "selenium-webdriver";

export async function waitForElement(driver, locator, timeout = 10000) {
    try {
        return await driver.wait(
            until.elementLocated(locator),
            timeout
        );
    } catch (error) {
        try {
            return await driver.findElement(locator);
        } catch {
            throw error;
        }
    }
}