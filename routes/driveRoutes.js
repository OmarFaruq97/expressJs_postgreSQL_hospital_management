const express = require("express");
const router = express.Router();
const driveController = require("../controllers/driveController");

// POST /api/drive/upload
router.post("/upload", driveController.uploadFile);

module.exports = router;
