import { Select } from "selenium-webdriver/lib/select.js";
import { waitForElement } from "../utils/wait-utils.mjs";
import { markHealing } from "../utils/healing-context.mjs";

export class BasePage {

    constructor(driver) {
        this.driver = driver;
    }

   async findElement(locator) {
    const element = await this.driver.findElement(locator);

    await this.detectHealing(locator, element);

    return element;
}

    async detectHealing(locator, element) {
        if (locator.id) {
            const actualId = await element.getAttribute("id");

            if (actualId && actualId !== locator.id) {
                markHealing();
                return;
            }
        }

        if (locator.name) {
            const actualName = await element.getAttribute("name");

            if (actualName && actualName !== locator.name) {
                markHealing();
                return;
            }
        }

        if (locator.className) {
            const actualClass = await element.getAttribute("class");

            if (
                actualClass &&
                !actualClass.split(/\s+/).includes(locator.className)
            ) {
                markHealing();
                return;
            }
        }

        if (locator.css) {
            const actualTag = await element.getTagName();

            if (actualTag) {
                const matches = await this.driver.executeScript(
                    `
                    const element = arguments[0];
                    const selector = arguments[1];

                    try {
                        return element.matches(selector);
                    } catch {
                        return false;
                    }
                    `,
                    element,
                    locator.css
                );

                if (!matches) {
                    markHealing();
                    return;
                }
            }
        }

        if (locator.xpath) {
            const matches = await this.driver.executeScript(
                `
                const element = arguments[0];
                const xpath = arguments[1];

                try {
                    const result = document.evaluate(
                        xpath,
                        document,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null
                    );

                    for (let i = 0; i < result.snapshotLength; i++) {
                        if (result.snapshotItem(i) === element) {
                            return true;
                        }
                    }

                    return false;
                } catch {
                    return false;
                }
                `,
                element,
                locator.xpath
            );

            if (!matches) {
                markHealing();
            }
        }
    }

    async click(locator) {
        const element = await this.findElement(locator);
        await element.click();
    }

    async type(locator, text) {
        const element = await this.findElement(locator);
        await element.sendKeys(text);
    }

    async getText(locator) {
        const element = await this.findElement(locator);
        return await element.getText();
    }

    async isDisplayed(locator) {
        const element = await this.findElement(locator);
        return await element.isDisplayed();
    }

    async getTitle() {
        return await this.driver.getTitle();
    }

    async navigateTo(url) {
        await this.driver.get(url);
    }

    async selectByVisibleText(locator, text) {
        const element = await this.findElement(locator);
        const select = new Select(element);

        await select.selectByVisibleText(text);
    }

    async getSelectedOptionText(locator) {
        const element = await this.findElement(locator);
        const select = new Select(element);

        const selectedOption = await select.getFirstSelectedOption();

        return await selectedOption.getText();
    }
}