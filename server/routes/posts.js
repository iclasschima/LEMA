const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /api/users/:userId/posts - List posts of a specific user with pagination
router.get("/users/:userId/posts", (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM posts WHERE user_id = ?";
  db.get(countSql, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const totalPosts = row.total;
    const totalPages = Math.ceil(totalPosts / limit);

    const sql = `SELECT * FROM posts WHERE user_id = ? LIMIT ? OFFSET ?`;
    db.all(sql, [userId, limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        data: rows,
        pagination: {
          total: totalPosts,
          page,
          limit,
          totalPages,
        },
      });
    });
  });
});

// DELETE /api/posts/:postId - Delete a specific post
router.delete("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const sql = `DELETE FROM posts WHERE id = ?`;
  db.run(sql, postId, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      res.status(404).json({ message: "Post not found." });
    } else {
      res.json({
        message: "Post deleted successfully.",
        changes: this.changes,
      });
    }
  });
});

module.exports = router;
