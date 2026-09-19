import { By, until } from "selenium-webdriver";

function toSeleniumLocator(locator) {
    if (!locator || typeof locator !== "object") {
        throw new TypeError("locator must be a non-null object");
    }

    if (locator.id) return By.id(locator.id);
    if (locator.css) return By.css(locator.css);
    if (locator.className) return By.className(locator.className);
    if (locator.name) return By.name(locator.name);
    if (locator.xpath) return By.xpath(locator.xpath);

    throw new Error(`Unsupported locator: ${JSON.stringify(locator)}`);
}

export async function waitForElement(driver, locator, timeout = 10000) {
    const seleniumLocator = toSeleniumLocator(locator);

    try {
        const element = await driver.wait(
            until.elementLocated(seleniumLocator),
            timeout
        );

        return {
            element,
            command: "findElements"
        };
    } catch (error) {
        console.log("waitForElement failed:", error);

        try {
            const element = await driver.findElement(seleniumLocator);

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
