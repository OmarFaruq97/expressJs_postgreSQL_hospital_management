const express = require("express");
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
