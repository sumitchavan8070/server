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
  const existingTest = await MainTest.findOne({ testId: TestId });
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
    console.log("im here");

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

const getPaperByCatIDSubCatIdAndYearId = async (req, res) => {
  try {
    const { catID, subCatID, QPYearID } = req.query;

    console.log(catID);
    console.log(subCatID);
    console.log(QPYearID);

    // Validate the query parameters
    if (!catID || !subCatID || !QPYearID) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const questionPapers = [];

    // Fetch the question paper data from the database
    const questions = await QuestionPaper.find({
      catID,
      subCatID,
      QPYearID,
    });

    questionPapers.push({
      catID: catID,
      subCatId: subCatID,
      yearId: subCatID,
      QPYear: QPYearID,
      questions: questions,
    });

    res.json(questionPapers);
  } catch (error) {
    console.error("Error fetching question paper data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Update a specific question by ID
// const updateQuestion = async (req, res) => {
//   try {
//     const { questionId } = req.params;
//     const updatedQuestionData = req.body;

//     const updatedQuestion = await QuestionPaper.findOneAndUpdate(
//       { "questions._id": questionId },
//       {
//         $set: {
//           "questions.$": updatedQuestionData,
//         },
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Question updated successfully", updatedQuestion });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updatedQuestionData = req.body;

    // Use the correct query to find the document and the specific question to update
    const updatedQuestion = await QuestionPaper.findOne({ _id: questionId });

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    updatedQuestion.question = updatedQuestionData.question;
    updatedQuestion.option1 = updatedQuestionData.option1;
    updatedQuestion.option2 = updatedQuestionData.option2;
    updatedQuestion.option3 = updatedQuestionData.option3;
    updatedQuestion.option4 = updatedQuestionData.option4;
    updatedQuestion.answer = updatedQuestionData.answer;

    // Save the updated document
    await updatedQuestion.save();
    // console.log("updatedQuestion" + updatedQuestion);

    res
      .status(200)
      .json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

// Delete a specific question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await QuestionPaper.findOneAndUpdate(
      { "questions._id": questionId },
      {
        $pull: {
          questions: { _id: questionId },
        },
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Question deleted successfully", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMainExamTestPaper,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  getQuestionPapersByFilter,
  updateQuestion,
  deleteQuestion,
  getPaperByCatIDSubCatIdAndYearId,
};
