const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure "uploads" folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("file");

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Send Email function
const sendEmail = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: "File upload error", error: err });

    const filePath = req.file ? req.file.path : null;

    try {
      // Nodemailer transporter with OAuth2
      const accessToken = await oAuth2Client.getAccessToken();

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "omor@wevics.com",
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });

      // Mail options
      let mailOptions = {
        from: '"Express Mailer" <omor@wevics.com>',
        to: req.body.to, // Recipient email from Postman
        subject: req.body.subject,
        text: req.body.text,
        attachments: filePath
          ? [
              {
                filename: req.file.originalname,
                path: filePath,
              },
            ]
          : [],
      };

      // Send email
      let info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully", info });
    } catch (error) {
      console.error("Email Error:", error);
      res.status(500).json({ message: "Email failed", error });
    }
  });
};

module.exports = { sendEmail };
