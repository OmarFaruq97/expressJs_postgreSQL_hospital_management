// routes/googleAuthRoutes.js
require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const fs = require("fs");

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
// 📌 UPLOAD FILE
// ========================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileMetadata = { name: req.file.originalname };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id,name",
    });


    fs.unlinkSync(req.file.path);

    res.json({
      message: " File uploaded successfully!",
      fileId: file.data.id,
      fileName: file.data.name
    });
  } catch (err) {
    console.error("❌ Error uploading file:", err.message);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});


// ========================
//  DOWNLOAD FILE
// ========================
router.get("/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;


    const fileMeta = await drive.files.get({
      fileId,
      fields: "name, mimeType",
    });

    const fileName = fileMeta.data.name;
    const mimeType = fileMeta.data.mimeType;

    const driveResponse = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    // header
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", mimeType);

    driveResponse.data.pipe(res);
  } catch (error) {
    console.error("❌ Error downloading file:", error.message);
    res.status(500).json({ error: "Download failed" });
  }
});

// ========================
//  SHARE WITH SPECIFIC USER
// ========================
router.post("/share/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    // Give access to a specific user
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "user",     // user share
        emailAddress: email,
      },
      fields: "id",
    });

    // Get shareable link (optional)
    const file = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    res.json({
      message: `✅ File shared with ${email}`,
      viewLink: file.data.webViewLink,
      downloadLink: file.data.webContentLink,
    });
  } catch (error) {
    console.error("❌ Error sharing file:", error.message);
    res.status(500).json({ error: "Failed to share file", details: error.message });
  }
});


module.exports = router;

