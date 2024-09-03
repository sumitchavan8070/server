const ExamCategory = require("../models/newExamCategory");
const SubExamCategory = require("../models/newSubExamType");
const ExamYear = require("../models/newExamYear");
const Subject = require("../models/newSubject");
const Topic = require("../models/newTopicModel");
const QuestionPaper = require("../models/newQuestionPaper");
const User = require("../models/userModel");

const getCategoriesWithYear = async (req, res) => {
  try {
    const categories = await ExamCategory.aggregate([
      {
        $lookup: {
          from: "subexamtypes",
          localField: "_id",
          foreignField: "catId",
          as: "subcategories",
        },
      },
      {
        $unwind: {
          path: "$subcategories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "examyears",
          localField: "subcategories._id",
          foreignField: "subCatId",
          as: "subcategories.years",
        },
      },
      {
        $unwind: {
          path: "$subcategories.years",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "questionpapers",
          localField: "subcategories.years._id",
          foreignField: "QPYearID",
          as: "subcategories.years.questions",
        },
      },
      {
        $group: {
          _id: "$_id",
          catName: { $first: "$catName" },
          catShortName: { $first: "$catShortName" },
          description: { $first: "$description" },
          image: { $first: "$image" },
          subcategories: {
            $push: {
              _id: "$subcategories._id",
              subCatName: "$subcategories.subCatName",
              years: "$subcategories.years",
            },
          },
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCategoriesWithYear };
