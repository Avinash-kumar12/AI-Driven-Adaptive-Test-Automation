import { until } from "selenium-webdriver";

export async function waitForElement(driver, locator, timeout = 10000) {
    return await driver.wait(
        until.elementLocated(locator),
        timeout
    );
}