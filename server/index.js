const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3001; // Server will run on port 3001 by default

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use("/api/users", userRoutes);
app.use("/api", postRoutes);

// Basic route for testing server status
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
