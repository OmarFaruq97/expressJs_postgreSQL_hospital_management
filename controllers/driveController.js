const { google } = require("googleapis");

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Drive instance
const drive = google.drive({ version: "v3", auth: oauth2Client });

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ status: "error", message: "No file uploaded" });

    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
      },
      media: {
        mimeType: req.file.mimetype,
        body: Buffer.from(req.file.buffer),
      },
    });

    res.json({
      status: "success",
      message: "File uploaded",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
