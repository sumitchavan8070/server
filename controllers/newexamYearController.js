const ExamYear = require("../models/newExamYear");

// Create a new exam year
const createExamYear = async (req, res) => {
  try {
    const { QPYear, catId, subCatId } = req.body;
    const newExamYear = new ExamYear({ QPYear, catId, subCatId });
    const savedExamYear = await newExamYear.save();
    res.status(201).json(savedExamYear);
  } catch (error) {
    res.status(400).json({ error: "Error creating exam year" });
  }
};

// Get exam years by category ID and sub exam type ID
const getExamYearsByCategoryAndSubType = async (req, res) => {
  try {
    const { categoryId, subExamTypeId } = req.params;
    const examYears = await ExamYear.find({
      catId: categoryId,
      subCatId: subExamTypeId,
    });
    res.status(200).json(examYears);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exam years" });
  }
};

// const getExamYearsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     console.log("catcategoryId" + categoryId);

//     const examYears = await ExamYear.find({
//       catId: categoryId,
//     });
//     res.status(200).json(examYears);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching exam years" });
//   }
// };

// Update an existing exam year
const updateExamYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { QPYear, catId, subCatId } = req.body;
    const updatedExamYear = await ExamYear.findByIdAndUpdate(
      id,
      { QPYear, catId, subCatId },
      { new: true }
    );
    res.status(200).json(updatedExamYear);
  } catch (error) {
    res.status(400).json({ error: "Error updating exam year" });
  }
};

// Delete an exam year
const deleteExamYear = async (req, res) => {
  try {
    const { id } = req.params;
    await ExamYear.findByIdAndDelete(id);
    res.status(200).json({ message: "Exam year deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting exam year" });
  }
};

// Controller to get ExamYear based on category ID
// const getExamYearByCategoryWithSubCat = async (req, res) => {
//   try {
//     const { catId } = req.params;

//     // Find ExamYears by category ID and populate the references
//     const examYears = await ExamYear.find({ catId })
//       .populate("catId") // Populating the full ExamCategory document
//       .populate("subCatId"); // Populating the full SubExamType document

//     if (!examYears || examYears.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No ExamYears found for this category." });
//     }

//     res.status(200).json(examYears);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getExamYearByCategoryWithSubCat = async (req, res) => {
  try {
    const { catId } = req.params;
    // console.log(catId);

    // Find ExamYears by category ID and populate the subCatId reference to get subCatName
    const examYears = await ExamYear.find({ catId })
      .populate({
        path: "subCatId", // Populate the `subCatId` field
        select: "subCatName", // Include only the `subCatName` field
      })
      .exec();

    if (!examYears || examYears.length === 0) {
      return res
        .status(404)
        .json({ message: "No ExamYears found for this category." });
    }

    // Format the response to include `subCatName` and `QPYear`
    const result = examYears.map((year) => ({
      // key: `${year.subCatId.subCatName}-${year.QPYear}`, // Combined key for display
      // value: year.QPYear, // The year itself as value
      // subCatId: year.subCatId._id, // The subcategory ID

      key: year._id,
      value: `${year.subCatId.subCatName}-${year.QPYear}`,
      subCatId: year.subCatId._id,
    }));

    // console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createExamYear,
  getExamYearsByCategoryAndSubType,
  updateExamYear,
  deleteExamYear,
  // getExamYearsByCategory,
  getExamYearByCategoryWithSubCat,
};
