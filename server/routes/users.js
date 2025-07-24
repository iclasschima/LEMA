const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 4;
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM users";
  db.get(countSql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const totalUsers = row.total;
    const totalPages = Math.ceil(totalUsers / limit);

    const sql = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.phone,
                a.street,
                a.state,
                a.city,
                a.zipcode
            FROM users u
            LEFT JOIN addresses a ON u.id = a.user_id
            LIMIT ? OFFSET ?
        `;
    db.all(sql, [limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const formattedUsers = rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        website: row.website,
        address: {
          street: row.street,
          suite: row.suite,
          city: row.city,
          zipcode: row.zipcode,
        },
      }));

      res.json({
        data: formattedUsers,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages,
        },
      });
    });
  });
});

module.exports = router;
