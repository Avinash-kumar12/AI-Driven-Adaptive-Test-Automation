import { Builder } from "selenium-webdriver";
import config from "../config/framework-config.mjs";

export async function createDriver() {
    const builder = new Builder()
        .forBrowser(config.browser)
        .usingServer(config.healeniumUrl);

    if (config.headless && config.browser === "chrome") {
        builder.setChromeOptions({
            args: ["--headless=new"]
        });
    }

    return await builder.build();
}