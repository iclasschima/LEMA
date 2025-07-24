// server/database.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs"); // Import fs module

// Use an environment variable for the database path, default to local if not set
const DB_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, "data.db");
console.log(`${DB_PATH} Database path`); // Keep this for debugging

// Ensure the directory for the database file exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

try {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error connecting to database:", err.message);
      // Propagate the error to prevent server from starting if DB connection fails
      throw err;
    } else {
      console.log("Connected to SQLite database at", DB_PATH);

      // Ensure tables exist after connection is established
      db.serialize(() => {
        db.run(
          `
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        phone TEXT,
                        website TEXT
                    )
                `,
          (err) => {
            if (err) {
              console.error("Error creating users table:", err.message);
            } else {
              console.log("Users table checked/created.");
            }
          }
        );

        db.run(
          `
                    CREATE TABLE IF NOT EXISTS addresses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id TEXT NOT NULL,
                        street TEXT,
                        suite TEXT,
                        city TEXT,
                        zipcode TEXT,
                        lat TEXT,
                        lng TEXT,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `,
          (err) => {
            if (err) {
              console.error("Error creating addresses table:", err.message);
            } else {
              console.log("Addresses table checked/created.");
            }
          }
        );

        db.run(
          `
                    CREATE TABLE IF NOT EXISTS posts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id TEXT NOT NULL,
                        title TEXT NOT NULL,
                        body TEXT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `,
          (err) => {
            if (err) {
              console.error("Error creating posts table:", err.message);
            } else {
              console.log("Posts table checked/created.");
            }
          }
        );

        // Optional: Seed data if the database is empty (for testing/initial setup)
        // You might want to make this conditional on whether data already exists
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
          if (err) {
            console.error("Error checking user count:", err.message);
            return;
          }
          if (row.count === 0) {
            console.log("Database is empty, seeding initial data...");
            const seedData = require("./seed"); // Assuming you have a seed.js
            if (seedData && typeof seedData.seedDatabase === "function") {
              seedData
                .seedDatabase(db)
                .then(() => {
                  console.log("Database seeded successfully.");
                })
                .catch((seedErr) => {
                  console.error("Error seeding database:", seedErr.message);
                });
            } else {
              console.warn(
                "Seed function not found or incorrectly structured."
              );
            }
          } else {
            console.log(
              `Database already contains ${row.count} users. Skipping seeding.`
            );
          }
        });
      });
    }
  });
} catch (e) {
  console.error("Failed to initialize database connection:", e.message);
  // Exit the process if database connection fails critically at startup
  process.exit(1);
}

module.exports = db;
