// routes/constantsRoutes.js
const express = require("express");
const {
  getConstants,
  createConstant,
  updateConstant,
  deleteConstant,
} = require("../controllers/constantsController");
const router = express.Router();

// Define routes for CRUD operations
router.get("/constants", getConstants); // Get all constants
router.post("/constants", createConstant); // Create a new constant
router.put("/constants/:key", updateConstant); // Update an existing constant by key
router.delete("/constants/:key", deleteConstant); // Delete a constant by key

module.exports = router;
