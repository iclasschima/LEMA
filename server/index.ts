import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import { getDb, closeDb } from "./database";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api", postRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running!");
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    res.status(200).json({
      status: "ok",
      message: "Backend is healthy and DB is accessible",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Backend is unhealthy, DB connection failed",
      error: (error as Error).message,
    });
  }
});

// Only start the server if this file is executed directly (not imported by a test)
if (require.main === module) {
  getDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database on server startup:", err);
      process.exit(1);
    });

  process.on("SIGINT", async () => {
    console.log(
      "SIGINT signal received: closing database connection and exiting."
    );
    try {
      await closeDb();
      process.exit(0);
    } catch (error) {
      console.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  });

  process.on("SIGTERM", async () => {
    console.log(
      "SIGTERM signal received: closing database connection and exiting."
    );
    try {
      await closeDb();
      process.exit(0);
    } catch (error) {
      console.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  });
}

export default app;
