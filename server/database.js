const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, "data.db");

console.log(DB_PATH, "Database path");

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
