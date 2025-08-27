require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const fs = require("fs");


const router = express.Router();
const upload = multer({ dest: "uploads/" });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

//  Upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const fileMetadata = { name: req.file.originalname };
    const media = {
      mimeType: "text/plain",
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      message: "File uploaded successfully!",
      fileId: file.data.id,
    });
  } catch (err) {
    console.error("Error uploading file:", err.message);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;

