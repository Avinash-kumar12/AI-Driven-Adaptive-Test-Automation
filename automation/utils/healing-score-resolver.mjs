import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.HEALENIUM_DB_HOST || "localhost",
    port: Number(process.env.HEALENIUM_DB_PORT || 5432),
    user: process.env.HEALENIUM_DB_USER || "healenium_user",
    password: process.env.HEALENIUM_DB_PASSWORD,
    database: process.env.HEALENIUM_DB_NAME || "healenium",
    allowExitOnIdle: true,
});

export async function connectHealingDatabase() {
    const client = await pool.connect();

    try {
        await client.query("SELECT 1");
        console.log("HEALENIUM DB CONNECTED");
    } finally {
        client.release();
    }
}

export async function getLatestHealingScore({
    locator,
    command,
    url
}) {
    const locatorType = Object.keys(locator)[0];
    const locatorValue = locator[locatorType];
    let healeniumLocatorValue = locatorValue;

if (locatorType === "id") {
    healeniumLocatorValue = `*[id="${locatorValue}"]`;
}

if (locatorType === "className") {
    healeniumLocatorValue = `.${locatorValue}`;
}

    const locatorTypeMap = {
    id: "By.cssSelector",
    css: "By.cssSelector",
    className: "By.cssSelector",
    name: "By.cssSelector",
    xpath: "By.xpath"
    };

    const healeniumType = locatorTypeMap[locatorType];

    if (!healeniumType || !locatorValue) {
        return null;
    }

    const selectorResult = await pool.query(
        `
        SELECT uid
        FROM healenium.selector
        WHERE locator::jsonb ->> 'type' = $1
          AND locator::jsonb ->> 'value' = $2
          AND command = $3
          AND url = $4
        ORDER BY uid DESC
        LIMIT 1
        `,
        [
            healeniumType,
            healeniumLocatorValue,
            command,
            url
        ]
    );

    if (selectorResult.rows.length === 0) {
        return null;
    }

    const selectorId = selectorResult.rows[0].uid;

    const healingResult = await pool.query(
        `
        SELECT hr.score
        FROM healenium.healing_result hr
        JOIN healenium.healing h
            ON hr.healing_id = h.uid
        WHERE h.selector_id = $1
          AND hr.success_healing = true
        ORDER BY hr.create_date DESC
        LIMIT 1
        `,
        [selectorId]
    );

    if (healingResult.rows.length === 0) {
        return null;
    }

    return Number(healingResult.rows[0].score);
}