const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/userController");
const {
  createExamCat,
  getAllExamCategoryList,
  getSelectedExamPage,
} = require("../controllers/examController");
const {
  createSubExamCat,
  getSubCategoryOfCategory,
  addYear,
  getYearData,
  getAllYear,
} = require("../controllers/examSubCatController");
const {
  fetchImportantUpdates,
} = require("../controllers/MpscUpdatesController");
const {
  getQuestionPaper,
  createQuestion,
  addSubject,
} = require("../controllers/questionPaperController");
const {
  addUserPost,
  getApprovedPosts,
  updateVote,
} = require("../controllers/userPostController");
const {
  deleteImageFromCloudinary,
} = require("../controllers/cloudinaryController");

const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//UPDATE || PUT
//router.put("/update-user", requireSingIn, updateUserController);

//getAll Category
router.get("/get-all-exam-category", getAllExamCategoryList);

//Add Category
router.post("/add-exam-category", createExamCat);

//get Selected Exam
router.get("/get-exam", getSelectedExamPage);

//Create Sub Category
router.post("/add-sub-exam-category", createSubExamCat);

//Get Sub Category of the Specific Category
router.get("/get-all-sub-category", getSubCategoryOfCategory);

// Add Year of Question Paper
router.post("/add-year", addYear);

//get Year data
router.get("/get-year", getYearData);

router.get("/get-all-year", getAllYear);

router.get("/mpsc", fetchImportantUpdates);

// Question Paper Route
router.get("/get-question-paper", getQuestionPaper);

//Add Question
router.post("/add-question", createQuestion);

//Add Subject
router.post("/add-subject", addSubject);

//add user post
router.post("/add-user-post", addUserPost);

// Route to get approved posts
router.get("/approved-posts", getApprovedPosts);

//Update Vote
router.put("/:pollId", updateVote);

//Delete Image from the Cloudinary
router.delete("/delete-image", deleteImageFromCloudinary);

module.exports = router;
