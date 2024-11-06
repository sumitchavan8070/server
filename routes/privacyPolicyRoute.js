// routes/privacyPolicyRoute.js
const express = require("express");
const router = express.Router();
const privacyPolicyController = require("../controllers/privacyPolicyController");

// Route to serve the Privacy Policy page
router.get("/privacy-policy", privacyPolicyController.getPrivacyPolicy);

module.exports = router;
