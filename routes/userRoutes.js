const express = require("express");
const {
  registerController,
  loginController,
  getUserById,
  updateUserFCMToken,
  updateUserBasicInfo,
  updateProfilePicture,
  updateUserSubscription,
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
  updateVote,
  getApprovedPolls,
} = require("../controllers/userPostController");
const {
  deleteImageFromCloudinary,
} = require("../controllers/cloudinaryController");
const { getApprovedPosts } = require("../controllers/postController");
const bannerController = require("../controllers/bannerController");
const { getAllPlans, getPlanById } = require("../controllers/plansController");
const {
  getCategoriesWithSubcategoriesAndYears,
} = require("../controllers/adminController");

const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerController);
router.put("/update-basic-info/:userId", updateUserBasicInfo);
router.put("/profile-pic/:userId", updateProfilePicture);

// LOGIN || POST
router.post("/login", loginController);

router.put("/fcm/:userId/update", updateUserFCMToken);

//UPDATE || PUT
//router.put("/update-user", requireSingIn, updateUserController);

//getAll Category
// router.get("/get-all-exam-category", getAllExamCategoryList);

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
router.get("/approved-polls", getApprovedPolls);

//Update Vote
router.put("/:pollId", updateVote);

//Delete Image from the Cloudinary
router.delete("/delete-image", deleteImageFromCloudinary);

router.get("/approved-posts", getApprovedPosts);

//Get User Profile by Id
router.get("/:id", getUserById);
router.get("/banner/get-all", bannerController.getBanners);

router.get("/plans/get-all", getAllPlans);

// Get a single pricing plan by `plan` field
router.get("/plans/:id", getPlanById);

router.put("/update-subscription/:userId", updateUserSubscription);

module.exports = router;
