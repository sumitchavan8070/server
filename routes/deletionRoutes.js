const express = require("express");
const deletionController = require("../controllers/deletionController");
const router = express.Router();

// Route to display the account deletion request form
router.get("/request-deletion", deletionController.getRequestDeletionPage);

// Route to handle form submissions
router.post("/request-deletion", deletionController.handleDeletionRequest);

module.exports = router;
