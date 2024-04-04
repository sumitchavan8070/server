const express = require("express");
const {
  getPoll,
  isPostApproved,
} = require("../controllers/adminPollControllter");

const router = express.Router();

router.get("/admin/polls", getPoll);
router.get("/admin/polls/:postId", isPostApproved);

module.exports = router;
