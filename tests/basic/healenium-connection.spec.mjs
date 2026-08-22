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

});