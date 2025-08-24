const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "No file uploaded" });
    }

    const fileMetadata = { name: req.file.originalname };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name",
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      status: "success",
      message: "File uploaded",
      data: response.data,
    });
  } catch (err) {
    console.error("Upload Error:", err); // full error object
    res.status(500).json({ status: "error", message: "File upload failed" });
  }
};
