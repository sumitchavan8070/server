const express = require("express");
const {
  getPoll,
  isPostApproved,
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

router.get("/polls", getPoll);
router.get("/polls/:postId", isPostApproved);

module.exports = router;
