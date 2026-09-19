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
        message TEXT,
        failureProbability REAL,
        riskLevel TEXT,
        prediction INTEGER,
        priority INTEGER,
        executedAt TEXT NOT NULL
    )
`);

module.exports = db;