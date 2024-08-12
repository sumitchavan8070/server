const AllPaper = require("../models/AllPaper");
const ExamYear = require("../models/newExamYear");
const QuestionPaper = require("../models/newQuestionPaper");
const SubExamType = require("../models/newSubExamType");

// Controller to create a new paper
const createPaper = async (req, res) => {
  try {
    const {
      testId,
      testName,
      totalQuestions,
      passingMarks,
      catID,
      QPYearID,
      questions,
    } = req.body;
    const newPaper = new AllPaper({
      testId,
      testName,
      totalQuestions,
      passingMarks,
      catID,
      QPYearID,
      questions,
    });
    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all papers
const getAllPapers = async (req, res) => {
  try {
    const papers = await AllPaper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getPaperByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const subcatAndYears = await ExamYear.find({ catId: categoryId })
//       .populate("QPYear") // Populate the category details
//       .populate("subCatId"); // Populate the subcategory details

//     console.log(JSON.stringify(categoryId));
//     res.json(subcatAndYears);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getPaperByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch subcategories and years
    const subcatAndYears = await ExamYear.find({ catId: categoryId });
    // console.log("Im here" + subcatAndYears);

    // console.log("1" + subcatAndYears);

    // Initialize an array to store question papers for each combination
    const questionPapers = [];

    // Iterate through each subcategory and year combination
    for (const subcatAndYear of subcatAndYears) {
      const { subCatId, _id: yearId } = subcatAndYear;

      const subCategory = await SubExamType.findById(subCatId);

      // Fetch questions for the current subcategory and year combination
      const questions = await QuestionPaper.find({
        subCatID: subCatId,
        // subCatName: subCategory ? subCategory.subCatName : "Unknown",
        QPYearID: yearId,
      });

      // Push the questions to the questionPapers array
      questionPapers.push({
        catID: categoryId,
        subCatId: subCatId,
        yearId: yearId,
        QPYear: subcatAndYear.QPYear,
        subCatName: subCategory ? subCategory.subCatName : "Unknown",
        questions: questions,
      });
    }

    res.json(questionPapers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaper, getAllPapers, getPaperByCategory };
