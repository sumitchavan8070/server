const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
// Create history
router.post("/", historyController.createHistory);

// Get paginated history
router.get("/:userId", historyController.getHistory);

// Get ALL history for user (no pagination)
router.get("/user/:userId/all", historyController.getUserHistoryAll);

// Update history
router.put("/:id", historyController.updateHistory);

// Delete history
router.delete("/:id", historyController.deleteHistory);

module.exports = router;
