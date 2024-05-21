const { Error } = require("mongoose");
const QuestionPaper = require("../models/questionPaperModel");
const Subject = require("../models/subjectModel");

const createQuestion = async (req, res) => {
  try {
    const {
      qpName,
      QPYearID,
      catID,
      subCatID,
      questionSubjectCatID,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
    } = req.body;

    const questionPaper = new QuestionPaper({
      qpName: qpName,
      QPYearID: QPYearID,
      catID: catID,
      subCatID: subCatID,
      questionSubjectCatID: questionSubjectCatID,
      question: question,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
      answer: answer,

      //Try  Answer = Key Option
    });

    const qpData = await questionPaper.save();

    if (!qpData) {
      return new Error("Question Paper Data Not Found");
    }

    res.status(201).send({
      success: true,
      message: "Question Paper Added Successfully",
      data: qpData,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getQuestionPaper = async (req, res) => {
  try {
    const { QPYearID, catID, subCatID } = req.query;

    // Perform MongoDB query using Mongoose to fetch data based on exam IDs
    const questionPapers = await QuestionPaper.find({
      catID: catID,
      subCatID: subCatID,
      QPYearID: QPYearID,
    }); // Populate ExamYear reference with 'year' field

    // Send the response back to the client
    res.json({
      status: true,
      message: "Data fetched successfully",
      data: questionPapers,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//========================================================Subject ===========================================================

const addSubject = async (req, res) => {
  try {
    const { subName, catID, subCatID, QPYearID } = req.body;
    const subject = new Subject({
      subName,
      catID,
      subCatID,
      QPYearID,
    });
    const subjectData = await subject.save();

    if (!subjectData) {
      throw new Error("Unable to Create Subjet");
    }

    res.status(201).send({
      status: true,
      message: "Subject Added Successfully",
      data: subjectData,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { getQuestionPaper, createQuestion, addSubject };
