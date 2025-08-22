const express = require("express");
const router = express.Router();
const driveController = require("../controllers/driveController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // temp folder

router.post("/upload", upload.single("file"), driveController.uploadFile);

module.exports = router;
