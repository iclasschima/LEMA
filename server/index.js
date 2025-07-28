"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const posts_1 = __importDefault(require("./routes/posts"));
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/api/users", users_1.default);
app.use("/api", posts_1.default);
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        res.status(200).json({
            status: "ok",
            message: "Backend is healthy and DB is accessible",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Backend is unhealthy, DB connection failed",
            error: error.message,
        });
    }
}));
// Only start the server if this file is executed directly (not imported by a test)
if (require.main === module) {
    (0, database_1.getDb)()
        .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
        .catch((err) => {
        console.error("Failed to connect to database on server startup:", err);
        process.exit(1);
    });
    process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("SIGINT signal received: closing database connection and exiting.");
        try {
            yield (0, database_1.closeDb)();
            process.exit(0);
        }
        catch (error) {
            console.error("Error during graceful shutdown:", error);
            process.exit(1);
        }
    }));
    process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("SIGTERM signal received: closing database connection and exiting.");
        try {
            yield (0, database_1.closeDb)();
            process.exit(0);
        }
        catch (error) {
            console.error("Error during graceful shutdown:", error);
            process.exit(1);
        }
    }));
}
exports.default = app;
