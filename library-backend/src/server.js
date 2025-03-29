const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./models");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const loanRoutes = require("./routes/loan.routes");
const reservationRoutes = require("./routes/reservation.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Library Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      books: "/api/books",
      loans: "/api/loans",
      reservations: "/api/reservations",
      dashboard: "/api/dashboard",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for testing
module.exports = app;

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = config.port;

  // Sync database and start server
  const startServer = async () => {
    try {
      // Sync database (set force to true to drop and recreate tables - use with caution!)
      const force = process.env.DB_FORCE_SYNC === "true";
      await syncDatabase(force);

      // Start server
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${config.nodeEnv}`);
        console.log(`Database: SQLite (file-based database)`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}
