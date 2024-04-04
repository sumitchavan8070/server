const express = require("express");
const {
  getPoll,
  isPostApproved,
  deletePoll,
} = require("../controllers/adminPollControllter");
const {
  registerController,
  loginController,
} = require("../controllers/userController");

const router = express.Router();

//Register
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//Get All Polls
router.get("/polls", getPoll);

// Reject or Approve Poll
router.get("/polls/:postId", isPostApproved);

router.delete("/polls/:id", deletePoll);

module.exports = router;
