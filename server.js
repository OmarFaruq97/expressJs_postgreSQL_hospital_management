require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

dotenv.config();
const app = express();

app.use(express.json());

// Use routes
app.use("/api/google", googleAuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Not set");
  console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Not set");
  console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI ? "Loaded" : "Not set");
  console.log("REFRESH_TOKEN from env:", process.env.REFRESH_TOKEN);
});