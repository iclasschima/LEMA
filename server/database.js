"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDbInstanceForTesting = exports.closeDb = exports.getDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let dbInstance = null;
const DEFAULT_DB_PATH = path_1.default.resolve(__dirname, "data.db");
const getDb = (customDbPath) => {
    return new Promise((resolve, reject) => {
        if (dbInstance && (customDbPath === ":memory:" || !customDbPath)) {
            return resolve(dbInstance);
        }
        const dbPathToUse = customDbPath || DEFAULT_DB_PATH;
        if (dbPathToUse !== ":memory:") {
            const dbDir = path_1.default.dirname(dbPathToUse);
            if (!fs_1.default.existsSync(dbDir)) {
                try {
                    fs_1.default.mkdirSync(dbDir, { recursive: true });
                    console.log(`Created DB directory: ${dbDir}`);
                }
                catch (err) {
                    console.error("Error creating database directory:", err.message);
                    return reject(err);
                }
            }
        }
        const db = new sqlite3_1.default.Database(dbPathToUse, (err) => {
            if (err) {
                console.error(`Error connecting to database at ${dbPathToUse}:`, err.message);
                return reject(err);
            }
            console.log(`Connected to SQLite database at ${dbPathToUse}`);
            dbInstance = db;
            if (dbPathToUse !== ":memory:" && !fs_1.default.existsSync(DEFAULT_DB_PATH)) {
                db.serialize(() => {
                    db.run(`
                        CREATE TABLE IF NOT EXISTS users (
                            id TEXT PRIMARY KEY,
                            name TEXT NOT NULL,
                            email TEXT NOT NULL UNIQUE,
                            phone TEXT,
                            website TEXT
                        );
                    `);
                    db.run(`
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
                    `);
                    db.run(`
                        CREATE TABLE IF NOT EXISTS posts (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id TEXT NOT NULL,
                            title TEXT NOT NULL,
                            body TEXT NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                        );
                    `);
                    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                        if (row.count === 0) {
                            console.log("Seeding initial data...");
                            db.run(`
                                INSERT INTO users (id, name, email, phone, website) VALUES
                                ('1', 'Leanne Graham', 'Sincere@april.biz', '1-770-736-8031 x56442', 'hildegard.org'),
                                ('2', 'Ervin Howell', 'Shanna@melissa.tv', '010-692-6593 x09125', 'anastasia.net'),
                                ('3', 'Clementine Bauch', 'Nathan@yesenia.net', '1-463-123-4447', 'ramiro.info'),
                                ('4', 'Patricia Lebsack', 'Julianne.OConner@kory.org', '493-170-9623 x156', 'kale.biz');
                            `);
                            db.run(`
                                INSERT INTO addresses (user_id, street, suite, city, state, zipcode, lat, lng) VALUES
                                ('1', 'Kulas Light', 'Apt. 556', 'Gwenborough', 'NY', '92998-3874', '-37.3159', '81.1496'),
                                ('2', 'Victor Plains', 'Suite 879', 'Wisokyburgh', 'GA', '90566-7771', '-43.9509', '-34.4618'),
                                ('3', 'Douglas Extension', 'Suite 847', 'McKenziehaven', 'CA', '59590-4157', '-68.6102', '-47.0653'),
                                ('4', 'Hoeger Mall', 'Apt. 692', 'South Elvis', 'TX', '53919-4257', '40.3117', '71.0560');
                            `);
                            db.run(`
                                INSERT INTO posts (user_id, title, body) VALUES
                                ('1', 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto'),
                                ('1', 'qui est esse', 'est rerum tempore vitae\\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\\nqui aperiam non debitis possimus qui neque nisi nulla'),
                                ('2', 'ea et jhon', 'voluptatem repellendus from aut dicta\\nvoluptatem nihil et aut non\\n rerum est autem sunt rem eveniet architecto'),
                                ('3', 'magnam facilis autem', 'et vel officiis et at\\nvoluptatem nihil et aut non\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto');
                            `);
                        }
                    });
                });
            }
            resolve(db);
        });
    });
};
exports.getDb = getDb;
const closeDb = () => {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            dbInstance.close((err) => {
                if (err) {
                    console.error("Error closing database:", err.message);
                    return reject(err);
                }
                console.log("Database connection closed.");
                dbInstance = null;
                resolve();
            });
        }
        else {
            resolve();
        }
    });
};
exports.closeDb = closeDb;
const setDbInstanceForTesting = (db) => {
    dbInstance = db;
};
exports.setDbInstanceForTesting = setDbInstanceForTesting;
