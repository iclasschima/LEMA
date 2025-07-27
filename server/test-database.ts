import sqlite3 from "sqlite3";
import { Database } from "sqlite3";
import path from "path";
import fs from "fs";

let testDb: Database | null = null;
const TEST_DB_PATH = ":memory:"; // Use in-memory database for tests

const createSchemaSql = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    website TEXT
);

CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    street TEXT,
    suite TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    lat TEXT,
    lng TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

// Basic seed data for testing
const seedDataSql = `
INSERT INTO users (id, name, email, phone, website) VALUES
('1', 'Test User 1', 'test1@example.com', '123-456-7890', 'test1.com'),
('2', 'Test User 2', 'test2@example.com', '098-765-4321', 'test2.org');

INSERT INTO addresses (user_id, street, suite, city, state, zipcode) VALUES
('1', '123 Test St', 'Apt 1', 'Test City', 'CA', '90210'),
('2', '456 Mock Rd', 'Suite B', 'Mock Town', 'NY', '10001');

INSERT INTO posts (user_id, title, body) VALUES
('1', 'User 1 Post Title 1', 'This is the body of user 1 post 1.'),
('1', 'User 1 Post Title 2', 'This is the body of user 1 post 2.'),
('2', 'User 2 Post Title 1', 'This is the body of user 2 post 1.');
`;

export const getTestDb = (): Promise<Database> => {
  return new Promise((resolve, reject) => {
    if (testDb) {
      return resolve(testDb);
    }

    const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
      if (err) {
        console.error("Error connecting to test database:", err.message);
        return reject(err);
      }
      console.log("Connected to in-memory test SQLite database.");
      testDb = db;

      db.serialize(() => {
        db.exec(createSchemaSql, (err) => {
          if (err) {
            console.error("Error creating test schema:", err.message);
            return reject(err);
          }
          console.log("Test schema created.");

          db.exec(seedDataSql, (err) => {
            if (err) {
              console.error("Error seeding test data:", err.message);
              return reject(err);
            }
            console.log("Test data seeded.");
            resolve(db);
          });
        });
      });
    });
  });
};

export const closeTestDb = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (testDb) {
      testDb.close((err) => {
        if (err) {
          console.error("Error closing test database:", err.message);
          return reject(err);
        }
        console.log("In-memory test database closed.");
        testDb = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
};

export const clearTestDb = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!testDb) {
      return reject(new Error("No test database connected to clear."));
    }
    testDb.serialize(() => {
      testDb!.exec(
        `
                DELETE FROM users;
                DELETE FROM addresses;
                DELETE FROM posts;
                VACUUM;
            `,
        (err) => {
          if (err) {
            console.error("Error clearing test database:", err.message);
            return reject(err);
          }
          console.log("Test database cleared.");
          resolve();
        }
      );
    });
  });
};
