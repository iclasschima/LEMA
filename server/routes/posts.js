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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const router = (0, express_1.Router)();
router.get("/users/:userId/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const userId = req.params.userId;
        const page = parseInt(req.query._page) || 1;
        const limit = parseInt(req.query._limit) || 20;
        const offset = (page - 1) * limit;
        db.get("SELECT id FROM users WHERE id = ?", [userId], (err, userRow) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!userRow) {
                return res.status(404).json({ error: "User not found" });
            }
            db.get("SELECT COUNT(*) as total FROM posts WHERE user_id = ?", [userId], (err, countRow) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                db.all(`
                    SELECT id, user_id AS userId, title, body
                    FROM posts
                    WHERE user_id = ?
                    LIMIT ? OFFSET ?
                `, [userId, limit, offset], (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({
                        data: rows,
                        pagination: {
                            total: countRow.total,
                            page,
                            limit,
                        },
                    });
                });
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const { userId, title, body } = req.body;
        if (!userId || !title || !body) {
            return res.status(400).json({
                error: "User ID, title, and body are required to create a post.",
            });
        }
        db.get("SELECT id FROM users WHERE id = ?", [userId], (err, userRow) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!userRow) {
                return res.status(404).json({ error: "User not found" });
            }
            const createdAt = new Date().toISOString();
            const postId = Date.now().toString();
            db.run("INSERT INTO posts (id, user_id, title, body, created_at) VALUES (?, ?, ?, ?, ?)", [postId, userId, title, body, createdAt], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({
                    message: "Post created successfully",
                    post: {
                        id: postId,
                        userId,
                        title,
                        body,
                        createdAt,
                    },
                });
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.delete("/posts/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const postId = req.params.postId;
        db.run("DELETE FROM posts WHERE id = ?", [postId], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ message: "Post deleted successfully", changes: this.changes });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
