// routes/students.js

const express = require("express");
const router = express.Router();
const {
  enableFreePlanForStudent,
  disablePlanForStudent,
  enableFreePlanForMultipleStudents,
  disablePlanForMultipleStudents,
  getGlobalFreePlanStatus,
  updateGlobalFreePlan,
  updateExpiryDate,
} = require("../controllers/studentController");

// Routes
router.put("/enable-free-plan/:studentId", enableFreePlanForStudent);
router.put("/disable-plan/:studentId", disablePlanForStudent);
router.put("/enable-free-plan", enableFreePlanForMultipleStudents); // Bulk operation
router.put("/disable-plan", disablePlanForMultipleStudents); // Bulk operation

router.get("/global-free-plan-status", getGlobalFreePlanStatus);
router.put("/update-global-free-plan", updateGlobalFreePlan);

router.put("/update-expiry-date", updateExpiryDate);

module.exports = router;
