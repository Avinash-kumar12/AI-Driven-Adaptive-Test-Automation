const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbDirectory = path.join(
    __dirname,
    "data",
    "db"
);

const dbPath = path.join(
    dbDirectory,
    "execution-history.db"
);

fs.mkdirSync(dbDirectory, {
    recursive: true
});

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS execution_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId TEXT NOT NULL,
        status TEXT NOT NULL,
        duration REAL,
        healed INTEGER,
        healingScore REAL,
        message TEXT,
        failureProbability REAL,
        riskLevel TEXT,
        prediction INTEGER,
        priority INTEGER,
        executedAt TEXT NOT NULL,
        timestamp TEXT
    )
`);

const columns = db
    .prepare("PRAGMA table_info(execution_history)")
    .all()
    .map((column) => column.name);

if (!columns.includes("healingScore")) {
    db.exec(
        "ALTER TABLE execution_history ADD COLUMN healingScore REAL"
    );
}

if (!columns.includes("timestamp")) {
    db.exec(
        "ALTER TABLE execution_history ADD COLUMN timestamp TEXT"
    );
}

module.exports = db;