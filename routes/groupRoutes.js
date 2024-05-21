const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const memberController = require("../controllers/memberController");
const messageController = require("../controllers/messageController");
const customTestController = require("../controllers/customTestController");

// Group routes
router.post("/group/create", groupController.createGroup);
router.get("/group/:groupId", groupController.getGroupById);
router.put("/group/update/:groupId", groupController.updateGroup);
router.delete("/group/delete/:groupId", groupController.deleteGroup);
router.get("/group/user/:userId", groupController.getGroupsByUserId);
router.get("/myChats/:id", groupController.myChats);
router.get("/chatById", groupController.chatById);

router.post("/join-group", groupController.joinGroupBySharedId);

// Member routes
router.post("/member/add", memberController.addMember);
router.put("/member/update/:memberId", memberController.updateMember);
// router.delete("/member/delete/:memberId", memberController.deleteMember);
router.delete(
  "/member/delete/:groupId/:memberId",
  memberController.deleteMember
);

router.delete("/member/left/:groupId/:memberId", memberController.leftGroup);

router.get("/member/search", memberController.searchUsers);

// Message routes
router.post("/message/create", messageController.createMessage);
router.get("/message/group/:groupId", messageController.getMessagesByGroupId);
router.put("/message/update/:messageId", messageController.updateMessage);
router.delete("/message/delete/:messageId", messageController.deleteMessage);

router.post("/sendMessage", messageController.sendMessage);
router.get("/myMessages", messageController.myMessages);

// CustomTest routes
router.post("/custom-test/create", customTestController.createCustomTest);
router.get("/custom-test/:testId", customTestController.getCustomTestById);
router.put(
  "/custom-test/update/:testId",
  customTestController.updateCustomTest
);
router.delete(
  "/custom-test/delete/:testId",
  customTestController.deleteCustomTest
);

module.exports = router;
