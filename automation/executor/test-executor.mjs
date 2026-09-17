import { createDriver } from "./driver-factory.mjs";
import { BasePage } from "../pages/base-page.mjs";

const TEST_URL =
    "https://healenium.github.io/healenium-test-env/index.html";

export async function executeAutomationTest(testId) {
    const driver = await createDriver();
    const page = new BasePage(driver);

    const start = Date.now();

    try {
        await page.navigateTo(TEST_URL);

        if (testId === "TC002") {
            await page.selectByVisibleText(
                { id: "select_item" },
                "Item 1"
            );

            const selected = await page.getSelectedOptionText({
                id: "select_item"
            });

            if (selected !== "Item 1") {
                throw new Error(`Expected Item 1, got ${selected}`);
            }

            return {
                testId,
                status: "passed",
                duration: (Date.now() - start) / 1000,
                healed: false,
                message: "Product selection test completed"
            };
        }

        if (testId === "TC004") {
            const visible = await page.isDisplayed({
                id: "select_item"
            });

            if (!visible) {
                throw new Error("Checkout test target is not visible");
            }

            return {
                testId,
                status: "passed",
                duration: (Date.now() - start) / 1000,
                healed: false,
                message: "Checkout test target verified"
            };
        }

        throw new Error(`Unsupported automation test: ${testId}`);
    } catch (error) {
        return {
            testId,
            status: "failed",
            duration: (Date.now() - start) / 1000,
            healed: false,
            message: error.message
        };
    } finally {
        await driver.quit();
    }
}