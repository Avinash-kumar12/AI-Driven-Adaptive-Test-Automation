import { Builder } from "selenium-webdriver";

const HEALENIUM_URL = "http://localhost:8085";

export async function createDriver() {
    const driver = await new Builder()
        .forBrowser("chrome")
        .usingServer(HEALENIUM_URL)
        .build();

    return driver;
}