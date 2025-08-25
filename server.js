require("dotenv").config(); // Must be first

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

// node-fetch ESM fix
(async () => {
  const fetchModule = await import("node-fetch");
  global.fetch = fetchModule.default;
  global.Headers = fetchModule.Headers;
})();

// Routes
const clinicalDiagnosisRoutes = require("./routes/clinicalDiagnosisRoutes");
const coMorbiditiesRoutes = require("./routes/coMorbiditiesRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const driveRoutes = require("./routes/driveRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to PostgreSQL database successfully");
    release();
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use("/api/clinical-diagnosis", clinicalDiagnosisRoutes);
app.use("/api/co-morbidities", coMorbiditiesRoutes);
app.use("/api/investigation", investigationRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/email", emailRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Database test endpoint
app.get("/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    res.json({ status: "success", time: result.rows[0].current_time });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Not set");
  console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Not set");
  console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI ? "Loaded" : "Not set");
  console.log("REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN ? "Loaded" : "Not set");
  // console.log("DB_HOST:", process.env.DB_HOST || "Not set");
});

/*const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);

const clinicalDiagnosisRoutes = require("./routes/clinicalDiagnosisRoutes");
const coMorbiditiesRoutes = require("./routes/coMorbiditiesRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const driveRoutes = require("./routes/driveRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API routes
app.use("/api/clinical-diagnosis", clinicalDiagnosisRoutes);
app.use("/api/co-morbidities", coMorbiditiesRoutes);
app.use("/api/investigation", investigationRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/drive", driveRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/email", emailRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/