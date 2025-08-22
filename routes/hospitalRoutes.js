const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/hospitalController");

// POST: CRUD
router.post("/", hospitalController.hospitalCrud);

// GET ALL
router.get("/", hospitalController.getAllHospitals);

// GET BY ID
router.get("/:id", hospitalController.getHospitalById);

module.exports = router;
