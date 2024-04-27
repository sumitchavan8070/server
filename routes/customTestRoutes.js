const express = require("express");
const router = express.Router();
const customTestController = require("../controllers/customTestController");

// Create a new custom test
router.post("/custom-test", customTestController.createCustomTest);

// Get all custom tests
router.get("/custom-test", customTestController.getAllCustomTests);

// Get a single custom test by ID
router.get("/custom-test/:id", customTestController.getCustomTestById);

// Update a custom test by ID
router.put("/custom-test/:id", customTestController.updateCustomTest);

// Delete a custom test by ID
router.delete("/custom-test/:id", customTestController.deleteCustomTest);

module.exports = router;
