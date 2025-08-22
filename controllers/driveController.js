const { google } = require("googleapis");
const multer = require("multer");
const fs = require("fs");

// Multer config (upload  save)
const upload = multer({ dest: "uploads/" });

// Google Drive Auth
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload function
exports.uploadFile = [
  upload.single("file"), // <--- field name "file"
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: "error", message: "No file uploaded" });
      }

      const fileMetadata = {
        name: req.file.originalname,
      };

      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id, webViewLink, webContentLink",
      });

      fs.unlinkSync(req.file.path);

      res.json({
        status: "success",
        message: "File uploaded successfully to Google Drive",
        data: response.data,
      });
    } catch (err) {
      console.error("Upload Error:", err.message);
      res.status(500).json({ status: "error", message: "File upload failed" });
    }
  },
];
