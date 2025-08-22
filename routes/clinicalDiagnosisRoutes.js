const express = require("express");
const router = express.Router();
const {
  clinicalDiagnosisCRUD,
  getClinicalDiagnoses,
  getClinicalDiagnosisById,
} = require("../controllers/clinicalDiagnosisController");
const { validateClinicalDiagnosis } = require("../middleware/validation");

// CRUD operations
router.post("/crud", validateClinicalDiagnosis, clinicalDiagnosisCRUD);

// Get all clinical diagnoses (optional filter by status)
router.get("/", getClinicalDiagnoses);

// Get clinical diagnosis by ID
router.get("/:id", getClinicalDiagnosisById);

module.exports = router;
