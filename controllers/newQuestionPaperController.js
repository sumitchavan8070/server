const QuestionPaper = require("../models/newQuestionPaper");
const MainTest = require("../models/GenerateTest");
const { Error } = require("mongoose");

// Create Question Paper
const createQuestionPaper = async (req, res) => {
  try {
    const {
      catID,
      subCatID,
      QPYearID,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      subjectID,
      topicID,
    } = req.body;

    const newQuestionPaper = new QuestionPaper({
      catID,
      subCatID,
      QPYearID,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      subjectID,
      topicID,
    });

    await newQuestionPaper.save();

    res.status(201).json({
      success: true,
      data: newQuestionPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuestionPapersByFilter = async (req, res, next) => {
  try {
    const { catID, subCatID, QPYearID } = req.body;

    // Construct the filter object based on selected dropdown values
    const filter = {};
    if (catID) filter.catID = catID;
    if (subCatID) filter.subCatID = subCatID;
    if (QPYearID) filter.QPYearID = QPYearID;

    const questionPapers = await QuestionPaper.find(filter);

    const count = questionPapers.length;

    if (count > 0) {
      res.status(200).json({
        success: true,
        count: count,
        data: questionPapers,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Question Paper Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const createMainExamTestPaper = async (req, res) => {
  try {
    const prefix = "MA";
    let TestId = await generateUniqueId(prefix);

    const { testName, totalQuestions, passingMarks, creatorId, questions } =
      req.body;

    // console.log("Questions -------" + JSON.stringify(questions));

    const questionsData = questions.map((question) => ({
      questionId: question._id,
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      answer: question.answer,
    }));

    const customTest = new MainTest({
      testId: TestId,
      testName,
      totalQuestions,
      passingMarks,
      creatorId,
      questions: questionsData,
    });

    const savedTest = await customTest.save();
    // console.log("savedTest -------" + JSON.stringify(savedTest));

    res.status(201).json({
      success: true,
      data: savedTest, // Send only the testId in the response
    });
  } catch (err) {
    console.error("Error creating custom test:", err);
    res.status(400).json({
      message:
        err.message || "An error occurred while creating the custom test.",
    });
  }
};

const generateUniqueId = async (prefix) => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generates 6 random digits
  const TestId = prefix + randomDigits;
  // console.log("Generated TestId:", TestId);

  // Check if TestId is unique, retry until unique TestId is generated
  while (!(await isTestIdUnique(TestId))) {
    TestId = prefix + Math.floor(100000 + Math.random() * 900000);
    console.log("Retry with new TestId:", TestId);
  }

  return TestId;
};

const isTestIdUnique = async (TestId) => {
  // console.log("Checking uniqueness for TestId:", TestId);
  const existingTest = await CustomTest.findOne({ testId: TestId });
  return !existingTest;
};

// Update Question Paper by ID
const updateQuestionPaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedQuestionPaper = await QuestionPaper.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestionPaper) {
      return res.status(404).json({
        success: false,
        error: "Question paper not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedQuestionPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete Question Paper by ID
const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findByIdAndDelete(req.params.id);
    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        error: "Question paper not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createMainExamTestPaper,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  getQuestionPapersByFilter,
};
