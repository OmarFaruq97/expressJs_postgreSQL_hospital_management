const express = require("express");
const router = express.Router();
const investigationController = require("../controllers/investigationController");

// POST: CRUD
router.post("/", investigationController.investigationCrud);

// GET ALL
router.get("/", investigationController.getAllInvestigations);

// GET BY ID
router.get("/:id", investigationController.getInvestigationById);

module.exports = router;
