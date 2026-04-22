const database = require('better-sqlite3')

// Create database.db in backend/dabase folder
const db = new database('todos.db');

// Create table
db.exec(`
    CREATE TABLE IF NOT EXISTS todos(
    ID TEXT PRIMARY KEY,
    task TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER DEFAULT 0,
    created_at TEXT NOT NULL)`);

module.exports = db;