import { createDriver } from "../../automation/executor/driver-factory.mjs";
import { BasePage } from "../../automation/pages/base-page.mjs";
import { Select } from "selenium-webdriver/lib/select.js";
import { registerTestMetadata } from "../../automation/utils/test-metadata.mjs";

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

    it("should create a browser session through Healenium", async () => {registerTestMetadata(
    "Healenium Driver Connection should create a browser session through Healenium",
    {
        testId: "TC-HEAL-CONNECTION-001",
        module: "healenium",
        scenario: "driver-connection",
        locatorType: null,
        healingExpected: false
    }
);
        driver = await createDriver();
        page = new BasePage(driver);

        await page.navigateTo(
            "https://healenium.github.io/healenium-test-env/index.html"
        );

        const title = await page.getTitle();

        expect(title).toBe("Healenium Test");
    });

    it("should select an item using BasePage", async () => {registerTestMetadata(
    "Healenium Driver Connection should select an item using BasePage",
    {
        testId: "TC-HEAL-BASE-001",
        module: "healenium",
        scenario: "select-option",
        locatorType: "id",
        healingExpected: false
    }
);
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

    it("should verify element visibility using BasePage", async () => {registerTestMetadata(
    "Healenium Driver Connection should verify element visibility using BasePage",
    {
        testId: "TC-HEAL-BASE-002",
        module: "healenium",
        scenario: "element-visibility",
        locatorType: "id",
        healingExpected: false
    }
);
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

    it("should automatically heal a changed locator through Healenium", async () => {registerTestMetadata(
    "Healenium Driver Connection should automatically heal a changed locator through Healenium",
    {
        testId: "TC-HEAL-ID-001",
        module: "healenium",
        scenario: "locator-healing",
        locatorType: "id",
        locator: {
    id: "select_item"
        },
        url: "https://healenium.github.io/healenium-test-env/index.html",
        healingExpected: true
    }
);
    driver = await createDriver();
    page = new BasePage(driver);

    await page.navigateTo(
        "https://healenium.github.io/healenium-test-env/index.html"
    );

    // STEP 1: Establish original locator in Healenium history
    const original = await page.findElement({
        id: "select_item"
    });

    expect(await original.getTagName()).toBe("select");

    // STEP 2: Change the locator in the application
    const changeButton = await page.findElement({
        xpath: "//button[contains(normalize-space(.), 'Change locators')]"
    });

    await changeButton.click();

    console.log("STEP 1: requesting healed element");

    // STEP 3: Intentionally use OLD locator
    // Healenium must find the element using its new locator.
    const healed = await page.findElement({
        id: "select_item"
    });

    console.log("STEP 2: healed element found");

    // STEP 4: Verify Healenium returned the correct element
    expect(await healed.getTagName()).toBe("select");

    console.log("STEP 3: tag verified");

    // STEP 5: Verify that the OLD locator was actually healed
    const healedId = await healed.getAttribute("id");

    console.log(`STEP 4: actual healed id = ${healedId}`);

    expect(healedId).toBe("select_item_NewId");

    console.log("STEP 5: healed id verified");

    // STEP 6: Perform a REAL operation using the healed element
    console.log("STEP 6: trying actual operation");

    const select = new Select(healed);
    await select.selectByVisibleText("Item 1");

    console.log("STEP 7: select operation completed");

    // STEP 7: Verify the operation actually worked
    const selected = await select.getFirstSelectedOption();
    const selectedText = await selected.getText();

    expect(selectedText).toBe("Item 1");

    console.log("STEP 8: actual operation verified");

    // Mark this test as healed only after the complete
    // healing + real operation succeeds.
});
it("should automatically heal a changed CSS locator through Healenium", async () => {registerTestMetadata(
    "Healenium Driver Connection should automatically heal a changed CSS locator through Healenium",
    {
        testId: "TC-HEAL-CSS-001",
        module: "healenium",
        url: "https://healenium.github.io/healenium-test-env/index.html",
        scenario: "locator-healing",
        locatorType: "css",
        locator: {
    css: "select#select_item"
    },
        healingExpected: true
    }
);
    driver = await createDriver();
    page = new BasePage(driver);

    await page.navigateTo(
        "https://healenium.github.io/healenium-test-env/index.html"
    );

    // Establish original CSS locator in Healenium history
    const original = await page.findElement({
        css: "select#select_item"
    });

    expect(await original.getTagName()).toBe("select");

    // Change locators in the application
    const changeButton = await page.findElement({
        xpath: "//button[contains(normalize-space(.), 'Change locators')]"
    });

    await changeButton.click();

    console.log("CSS STEP 1: requesting healed element");

    // Intentionally use OLD CSS locator
    const healed = await page.findElement({
        css: "select#select_item"
    });

    console.log("CSS STEP 2: healed element found");

    expect(await healed.getTagName()).toBe("select");

    console.log("CSS STEP 3: tag verified");

    const healedId = await healed.getAttribute("id");

    console.log(`CSS STEP 4: actual healed id = ${healedId}`);

    expect(healedId).not.toBe("select_item");

    console.log("CSS STEP 5: CSS locator healed");

    // Real operation
    const select = new Select(healed);

    await select.selectByVisibleText("Item 1");

    console.log("CSS STEP 6: select operation completed");

    const selected = await select.getFirstSelectedOption();
    const selectedText = await selected.getText();

    expect(selectedText).toBe("Item 1");

    console.log("CSS STEP 7: actual operation verified");
});
it("should automatically heal a changed XPath locator through Healenium", async () => {
    registerTestMetadata(
        "Healenium Driver Connection should automatically heal a changed XPath locator through Healenium",
        {
            testId: "TC-HEAL-XPATH-001",
            module: "healenium",
            scenario: "locator-healing",
            locatorType: "xpath",
            locator: {
    xpath: "//select[@name='item']"
},
    url: "https://healenium.github.io/healenium-test-env/index.html",
            healingExpected: true
        }
    );

    driver = await createDriver();
    page = new BasePage(driver);

    await page.navigateTo(
        "https://healenium.github.io/healenium-test-env/index.html"
    );

    // Establish original XPath locator in Healenium history
    const original = await page.findElement({
        xpath: "//select[@name='item']"
    });

    expect(await original.getTagName()).toBe("select");

    // Change locators in the application
    const changeButton = await page.findElement({
        xpath: "//button[contains(normalize-space(.), 'Change locators')]"
    });

    await changeButton.click();

    console.log("XPATH STEP 1: requesting healed element");

    // Intentionally use OLD XPath locator
    const healed = await page.findElement({
        xpath: "//select[@name='item']"
    });

    console.log("XPATH STEP 2: healed element found");

    expect(await healed.getTagName()).toBe("select");

    console.log("XPATH STEP 3: tag verified");

    // Real operation
    const select = new Select(healed);

    await select.selectByVisibleText("Item 1");

    console.log("XPATH STEP 4: select operation completed");

    const selected = await select.getFirstSelectedOption();
    const selectedText = await selected.getText();

    expect(selectedText).toBe("Item 1");

    console.log("XPATH STEP 5: actual operation verified");
});
it("should automatically heal a changed class locator through Healenium", async () => {registerTestMetadata(
    "Healenium Driver Connection should automatically heal a changed class locator through Healenium",
    {
        testId: "TC-HEAL-CLASS-001",
        module: "healenium",
        scenario: "locator-healing",
        locatorType: "class",
        locator: {
    className: "test_class"
    },  
    url: "https://healenium.github.io/healenium-test-env/index.html",
        healingExpected: true
    }
);
    driver = await createDriver();
    page = new BasePage(driver);

    await page.navigateTo(
        "https://healenium.github.io/healenium-test-env/index.html"
    );

    // Establish original class locator
    const original = await page.findElement({
        className: "test_class"
    });

    expect(await original.getAttribute("class"))
        .toContain("test_class");

    // Change locators in the application
    const changeButton = await page.findElement({
        id: "Submit"
    });

    await changeButton.click();

    console.log("CLASS STEP 1: requesting healed element");

    // Intentionally use OLD class locator
    const healed = await page.findElement({
        className: "test_class"
    });

    console.log("CLASS STEP 2: healed element found");

    const healedClass = await healed.getAttribute("class");

    console.log(`CLASS STEP 3: actual healed class = ${healedClass}`);

    expect(healedClass).not.toBe("test_class");

    console.log("CLASS STEP 4: healed class verified");
});
});

