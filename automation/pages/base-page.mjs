import { Select } from "selenium-webdriver/lib/select.js";
import { waitForElement } from "../utils/wait-utils.mjs";

export class BasePage {

    constructor(driver) {
        this.driver = driver;
    }

    async findElement(locator) {
        return await waitForElement(this.driver, locator);
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