const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const {connectDB} = require("./config/db");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.evv.REACT_APP_BACKEND_URL,
  credentials: true,
};

const _dirname = path.resolve();

// Middleware
app.use(cors(corsOptions)); // Enable cross-origin resource sharing
app.use(bodyParser.json());

// Connect to Main Database Before Starting Server
connectDB()
  .then(() => {
    console.log("Main Database Connected");

    // Routes
    app.use("/api/auth", authRoutes);

    // Serve static files for React frontend
    app.use(express.static(path.join(_dirname, "/frontend/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(_dirname, "frontend", "build", "index.html"));
    });

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if DB connection fails
  });