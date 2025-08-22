const express = require("express");
const router = express.Router();
const {
  coMorbiditiesCRUD,
  getCoMorbidities,
  getCoMorbidityById,
} = require("../controllers/coMorbiditiesController");
const { validateCoMorbidities } = require("../middleware/validation");

// CRUD operations
router.post("/crud", validateCoMorbidities, coMorbiditiesCRUD);

// Get all co-morbidities (optional filter by status)
router.get("/", getCoMorbidities);

// Get co-morbidity by ID
router.get("/:id", getCoMorbidityById);

module.exports = router;
