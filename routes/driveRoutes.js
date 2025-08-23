const express = require("express");
const router = express.Router();
const multer = require("multer");
const driveController = require("../controllers/driveController");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), driveController.uploadFile);

module.exports = router;
