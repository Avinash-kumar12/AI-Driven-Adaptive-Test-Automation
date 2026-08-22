export class BasePage {

    constructor(driver) {
        this.driver = driver;
    }

    async findElement(locator) {
        return await this.driver.findElement(locator);
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

    async getTitle() {
        return await this.driver.getTitle();
    }

    async navigateTo(url) {
        await this.driver.get(url);
    }
}