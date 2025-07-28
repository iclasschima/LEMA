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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const page = parseInt(req.query._page) || 1;
        const limit = parseInt(req.query._limit) || 10;
        const offset = (page - 1) * limit;
        db.get("SELECT COUNT(*) as total FROM users", (err, countRow) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            db.all(`
                SELECT
                    u.id, u.name, u.email, u.phone,
                    a.street, a.city, a.state, a.zipcode
                FROM
                    users u
                LEFT JOIN
                    addresses a ON u.id = a.user_id
                LIMIT ? OFFSET ?
            `, [limit, offset], (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                const usersWithAddresses = rows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    address: row.street
                        ? {
                            street: row.street,
                            city: row.city,
                            state: row.state,
                            zipcode: row.zipcode,
                        }
                        : null,
                }));
                res.json({
                    data: usersWithAddresses,
                    pagination: {
                        total: countRow.total,
                        page,
                        limit,
                        totalPages: Math.ceil(countRow.total / limit),
                    },
                });
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
