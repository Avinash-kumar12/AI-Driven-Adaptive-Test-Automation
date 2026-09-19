const config = {
    browser: process.env.BROWSER || "chrome",
    healeniumUrl: process.env.HEALENIUM_URL || "http://localhost:8085",
    headless: process.env.HEADLESS === "true"
};

export default config;