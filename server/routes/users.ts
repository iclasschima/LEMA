import { Router, Request, Response } from "express";
import { getDb } from "../database";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const offset = (page - 1) * limit;

    db.get(
      "SELECT COUNT(*) as total FROM users",
      (err, countRow: { total: number }) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        db.all(
          `
                SELECT
                    u.id, u.name, u.email, u.phone,
                    a.street, a.city, a.state, a.zipcode
                FROM
                    users u
                LEFT JOIN
                    addresses a ON u.id = a.user_id
                LIMIT ? OFFSET ?
            `,
          [limit, offset],
          (err, rows: any[]) => {
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
          }
        );
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
