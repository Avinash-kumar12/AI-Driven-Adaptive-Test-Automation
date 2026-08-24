import { createDriver } from "../../automation/executor/driver-factory.mjs";
import { BasePage } from "../../automation/pages/base-page.mjs";

describe("Healenium Driver Connection", () => {

    let driver;
    let page;

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(async () => {
        if (driver) {
            await driver.quit();
            driver = null;
        }
    });

    it("should create a browser session through Healenium", async () => {
        driver = await createDriver();
        page = new BasePage(driver);

        await page.navigateTo(
            "https://healenium.github.io/healenium-test-env/index.html"
        );

        const title = await page.getTitle();

        expect(title).toBe("Healenium Test");
    });

    it("should select an item using BasePage", async () => {
        driver = await createDriver();
        page = new BasePage(driver);

        await page.navigateTo(
            "https://healenium.github.io/healenium-test-env/index.html"
        );

        await page.selectByVisibleText(
            { id: "select_item" },
            "Item 1"
        );

        const selected = await page.getSelectedOptionText({
            id: "select_item"
        });

        expect(selected).toBe("Item 1");
    });

    it("should verify element visibility using BasePage", async () => {
        driver = await createDriver();
        page = new BasePage(driver);

        await page.navigateTo(
            "https://healenium.github.io/healenium-test-env/index.html"
        );

        const isVisible = await page.isDisplayed({
            id: "select_item"
        });

        expect(isVisible).toBeTrue();
    });

    it("should automatically heal a changed locator through Healenium", async () => {
    driver = await createDriver();
    page = new BasePage(driver);

    await page.navigateTo(
        "https://healenium.github.io/healenium-test-env/index.html"
    );

    // First establish the original locator in Healenium history
    const original = await page.findElement({
        id: "select_item"
    });

    expect(await original.getTagName()).toBe("select");

    // Change the locator in the application
    const changeButton = await page.findElement({
        xpath: "//button[contains(normalize-space(.), 'Change locators')]"
    });

    await changeButton.click();

    // IMPORTANT:
    // Ask Healenium to resolve the OLD locator again.
    // We intentionally DO NOT use select_item_NewId here.
    const healed = await page.findElement({
        id: "select_item"
    });

    expect(await healed.getTagName()).toBe("select");

    const healedId = await healed.getAttribute("id");

    expect(healedId).toBe("select_item_NewId");
    });
});