import { createDriver } from "../../automation/executor/driver-factory.mjs";

describe("Healenium Driver Connection", () => {

    let driver;

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

        await driver.get(
            "https://healenium.github.io/healenium-test-env/index.html"
        );

        const title = await driver.getTitle();

        expect(title).toBeTruthy();
    });
});