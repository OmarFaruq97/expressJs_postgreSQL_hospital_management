require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const googleAuthRoutes = require("./routes/googleAuthRoutes"); // এই লাইন টপে থাকবে

dotenv.config();
const app = express();

app.use(express.json());

// Use routes
app.use("/api/google", googleAuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("REFRESH_TOKEN from env:", process.env.REFRESH_TOKEN);

});


// require("dotenv").config();
// const express = require("express");
// const { Pool } = require("pg");

// const app = express();

// // PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USERNAME,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool.connect()
//   .then(() => console.log("Connected to PostgreSQL database"))
//   .catch((err) => console.error("Error connecting to database:", err));

// // Import Google Auth routes
// const googleAuthRoutes = require("./routes/googleAuthRoutes");
// app.use("/api/google", googleAuthRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Not set");
//   console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Not set");
//   console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI ? "Loaded" : "Not set");
//   console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "Loaded" : "Not set");
// });

// module.exports = pool;

/* ****

const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Error connecting to database:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/google", googleAuthRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Debugging logs for env variables
  console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Not set");
  console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Not set");
  console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI ? "Loaded" : "Not set");
  console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "Loaded" : "Not set");
});

module.exports = pool;


*/

/*
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
*/

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