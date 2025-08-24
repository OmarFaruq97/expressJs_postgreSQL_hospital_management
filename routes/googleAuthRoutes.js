const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

router.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    prompt: "consent",
  });
  res.redirect(authUrl);
});

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    res.send("Authentication successful! Check console for tokens.");
  } catch (err) {
    console.error(err);
    res.send("Error retrieving tokens");
  }
});

module.exports = router;
