const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// POST: CRUD
router.post("/", doctorController.doctorCrud);

// GET ALL
router.get("/", doctorController.getAllDoctors);

// GET BY ID
router.get("/:id", doctorController.getDoctorById);

module.exports = router;
