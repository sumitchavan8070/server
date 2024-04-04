const express = require("express");
const {
  getPoll,
  isPostApproved,
} = require("../controllers/adminPollControllter");

const router = express.Router();

router.get("/polls", getPoll);
router.get("/polls/:postId", isPostApproved);

module.exports = router;
