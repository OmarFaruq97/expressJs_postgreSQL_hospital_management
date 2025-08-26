const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Google OAuth2 Client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });


// ========================
// 📌 DOWNLOAD FILE
// ========================
router.get("/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const driveResponse = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileId}.txt"`);
    res.setHeader("Content-Type", "text/plain");

    driveResponse.data.pipe(res);
  } catch (error) {
    console.error("❌ Error downloading file:", error.message);
    res.status(500).json({ error: "Download failed" });
  }
});


// ========================
// 📌 GENERATE SHARE LINK
// ========================
router.post("/share/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // Make file public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get shareable link
    const file = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    res.json({
      message: "Share link generated",
      viewLink: file.data.webViewLink,     // Open in browser
      downloadLink: file.data.webContentLink, // Direct download
    });
  } catch (error) {
    console.error("❌ Error generating share link:", error.message);
    res.status(500).json({ error: "Failed to generate share link" });
  }
});

module.exports = router;


/*
// routes/googleAuthRoutes.js
const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Google OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

if (process.env.REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
} else {
  console.error("❌ REFRESH_TOKEN missing in .env file!");
}

// Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file received from Postman");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const fileMetadata = {
      name: req.file.originalname,
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    console.log("📂 Uploading file:", req.file.originalname);

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    // delete temp file after upload
    fs.unlinkSync(req.file.path);

    return res.json({
      message: "File uploaded successfully!",
      fileId: response.data.id,
    });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

module.exports = router;
*/






/*const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Refresh Token সেট করা
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Google Drive API instance
const drive = google.drive({ version: "v3", auth: oAuth2Client });

/**
 * Test Upload Route
 *//*
router.get("/upload", async (req, res) => {
  try {
    const fileMetadata = {
      name: "test.txt",
    };

    const media = {
      mimeType: "text/plain",
      body: "Hello from Express + Google Drive API!",
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: "text/plain",
        body: media.body,
      },
      fields: "id",
    });

    res.json({ message: "File uploaded successfully!", fileId: response.data.id });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed", details: error.message });
  }
});

module.exports = router;

*/