const ExamCategory = require("../models/newExamCategory");
const SubExamCategory = require("../models/newSubExamType");
const ExamYear = require("../models/newExamYear");
const Subject = require("../models/newSubject");
const Topic = require("../models/newTopicModel");
const QuestionPaper = require("../models/newQuestionPaper");
const User = require("../models/userModel");

// const createExamCategory = async (req, res) => {
//   try {
//     const { catName, description, image, pdfFiles } = req.body;
//     const newCategory = new ExamCategory({
//       catName,
//       description,
//       image,
//       pdfFiles, // Add this line to include pdfFiles
//     });
//     const savedCategory = await newCategory.save();
//     res.status(201).json(savedCategory);
//   } catch (error) {
//     console.log(error);

//     res.status(400).json({ error: "Error creating exam category" });
//   }
// };

const createExamCategory = async (req, res) => {
  try {
    const { catName, catShortName, description, image, pdfFiles } = req.body;

    // Find the highest categoryNumber and increment it
    const lastCategory = await ExamCategory.findOne({})
      .sort({ categoryNumber: -1 })
      .exec();

    const newCategoryNumber = lastCategory
      ? lastCategory.categoryNumber + 1
      : 1;

    const newCategory = new ExamCategory({
      catName,
      catShortName,
      description,
      image,
      pdfFiles,
      categoryNumber: newCategoryNumber,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error creating exam category" });
  }
};

const getExamCategories = async (req, res) => {
  try {
    const categories = await ExamCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exam categories" });
  }
};

const deleteExamCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Implement deletion logic here
    const deletedCategory = await ExamCategory.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

// const updateExamCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const { catName, catShortName, description, image, pdfFiles } = req.body;

//     const updatedCategory = await ExamCategory.findByIdAndUpdate(
//       categoryId,
//       { catName, catShortName, description, image, pdfFiles },
//       { new: true }
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     console.error("Error updating category:", error);
//     res.status(500).json({ error: "Error updating category" });
//   }
// };

const updateExamCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      catName,
      catShortName,
      description,
      image,
      pdfFiles,
      categoryNumber,
    } = req.body;

    // Validate categoryNumber to ensure it's a non-negative number
    if (categoryNumber !== undefined) {
      if (typeof categoryNumber !== "number" || categoryNumber < 0) {
        return res
          .status(400)
          .json({ error: "Category number must be a non-negative number" });
      }

      const existingCategory = await ExamCategory.findOne({ categoryNumber });
      if (existingCategory && existingCategory._id.toString() !== categoryId) {
        return res.status(400).json({
          error: "Category number already in use by another category",
        });
      }
    }

    const updatedCategory = await ExamCategory.findByIdAndUpdate(
      categoryId,
      { catName, catShortName, description, image, pdfFiles, categoryNumber },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Error updating category" });
  }
};

// Sub Cat
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubExamCategory.find();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};

const getCategoriesWithSubcategories = async (req, res) => {
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
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoriesWithSubcategoriesAndYears = async (req, res) => {
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
        $group: {
          _id: "$_id",
          catName: { $first: "$catName" },
          catShortName: { $first: "$catShortName" },
          description: { $first: "$description" },
          image: { $first: "$image" },
          subcategories: { $push: "$subcategories" },
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

const getCategoriesWithSubcategoriesAndYearsAndQuestionPaper = async (
  req,
  res
) => {
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

const createExamEntry = async (req, res) => {
  const { categoryId, subCatName, year } = req.body;

  try {
    // Validate categoryId
    const category = await ExamCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create SubExamType entry
    const newSubExamType = new SubExamCategory({
      subCatName,
      catId: categoryId,
    });

    const savedSubExamType = await newSubExamType.save();

    // Create ExamYear entry
    const newExamYear = new ExamYear({
      QPYear: year,
      catId: categoryId,
      subCatId: savedSubExamType._id,
    });

    const savedExamYear = await newExamYear.save();

    // Respond with the created entries
    res.status(201).json({
      category: category,
      subExamType: savedSubExamType,
      examYear: savedExamYear,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeYearWithPaper = async (req, res) => {
  try {
    const { yearId } = req.params;
    // Find and delete all questions related to that year
    await QuestionPaper.deleteMany({ QPYearID: yearId });
    // Remove the year entry from the ExamYear collection
    await ExamYear.findByIdAndDelete(yearId);

    res
      .status(200)
      .json({ message: "Year and related questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete year", error });
  }
};

const removeSubcategoryWithYearsAndPapers = async (req, res) => {
  try {
    const { subCategoryId, yearId } = req.body;

    if (yearId) {
      // Delete all question papers related to the specific year
      await QuestionPaper.deleteMany({ QPYearID: yearId });

      // Remove the specific year entry
      await ExamYear.findByIdAndDelete(yearId);

      const removedSubcategory = await SubExamCategory.findByIdAndDelete(
        subCategoryId
      );

      if (!removedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      res.status(200).json({
        message:
          "Year, related questions, and subcategory updated successfully",
      });
    } else {
      const removedSubcategory = await SubExamCategory.findByIdAndDelete(
        subCategoryId
      );

      if (!removedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.status(200).json({
        message:
          "Subcategory, related years, and questions deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subcategory", error });
  }
};

// const removeSubcategoryWithYearsAndPapers = async (req, res) => {
//   try {
//     const { subCategoryId, yearId } = req.body;

//     if (yearId) {
//       // Delete all question papers related to the specific year
//       await QuestionPaper.deleteMany({ QPYearID: yearId });

//       // Remove the specific year entry
//       await ExamYear.findByIdAndDelete(yearId);

//       // Remove the year from the subcategory
//       const updateResult = await SubExamCategory.updateMany(
//         { "subcategories.years._id": yearId },
//         { $pull: { "subcategories.$[].years": { _id: yearId } } }
//       );

//       // Check if any documents were modified
//       if (updateResult.nModified === 0) {
//         return res
//           .status(404)
//           .json({ message: "Year not found in subcategory" });
//       }

//       res
//         .status(200)
//         .json({ message: "Year and related questions deleted successfully" });
//     } else {
//       // Find all years related to the subcategory
//       const years = await ExamYear.find({ subCatId: subCategoryId });

//       // Delete all question papers related to each year of the subcategory
//       for (const year of years) {
//         await QuestionPaper.deleteMany({ QPYearID: year._id });
//       }

//       // Delete all years related to the subcategory
//       await ExamYear.deleteMany({ subCatId: subCategoryId });

//       // Remove the subcategory itself
//       const updateResult = await SubExamCategory.updateMany(
//         { "subcategories._id": subCategoryId },
//         { $pull: { subcategories: { _id: subCategoryId } } }
//       );

//       // Check if any documents were modified
//       if (updateResult.nModified === 0) {
//         return res.status(404).json({ message: "Subcategory not found" });
//       }

//       res
//         .status(200)
//         .json({
//           message:
//             "Subcategory, related years, and questions deleted successfully",
//         });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete subcategory", error });
//   }
// };

// const findSubCategoriesByCategoryId = async (req, res) => {
//   const categoryId = req.params.categoryId;
//   try {
//     const subCategories = await SubExamCategory.find({ catId: categoryId });
//     res.status(200).json(subCategories);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error });
//   }
// };

const findSubCategoriesByCategoryId = async (req, res) => {
  const catId = req.params.categoryId;
  //   console.log(catId);
  try {
    const subCategories = await SubExamCategory.find({ catId });
    const category = await ExamCategory.findById(catId);
    const categoryName = category ? category.catName : "Unknown Category";
    const result = {
      categoryName,
      subCategories,
    };
    res.status(200).json(result);
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// Controller function to add a new subcategory
const addSubcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { subCatName } = req.body;

  try {
    // Implement logic to create and save the new subcategory
    const newSubcategory = await SubExamCategory.create({
      subCatName,
      catId: categoryId,
    });

    res.status(201).json(newSubcategory);
    console.log("===>" + newSubcategory);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update an existing subcategory
const updateSubcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const subcategoryId = req.params.subcategoryId;
  const { subCatName } = req.body;

  try {
    // Implement logic to find and update the existing subcategory
    const updatedSubcategory = await SubExamCategory.findByIdAndUpdate(
      subcategoryId,
      { subCatName },
      { new: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.status(200).json(updatedSubcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

// Controller function to remove an existing subcategory
const removeSubcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const subcategoryId = req.params.subcategoryId;

  try {
    // Implement logic to find and remove the existing subcategory
    const removedSubcategory = await SubExamCategory.findByIdAndDelete(
      subcategoryId
    );

    if (!removedSubcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory removed successfully" });
  } catch (error) {
    console.error("Error removing subcategory:", error);
    res.status(500).json({ error: "Failed to remove subcategory" });
  }
};

//Years
// Import necessary modules

const getYearsBySubcategoryId = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const years = await ExamYear.find({
      catId: categoryId,
      subCatId: subcategoryId,
    });
    res.status(200).json(years);
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ error: "Error fetching years" });
  }
};

// const addYear = async (req, res) => {
//   try {
//     const { categoryId, subcategoryId } = req.params;
//     const { QPYear } = req.body;
//     const newYear = new ExamYear({
//       QPYear,
//       catId: categoryId,
//       subCatId: subcategoryId,
//     });
//     await newYear.save();
//     res.status(201).json({ message: "Year added successfully", year: newYear });
//   } catch (error) {
//     console.error("Error adding year:", error);
//     res.status(500).json({ error: "Error adding year" });
//   }
// };

const addYear = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { QPYear } = req.body;

    // Check if the year already exists for the given category and subcategory
    const existingYear = await ExamYear.findOne({
      QPYear,
      catId: categoryId,
      subCatId: subcategoryId,
    });

    if (existingYear) {
      return res.status(400).json({ error: "Year already exists" });
    }

    // If the year doesn't exist, create a new year document
    const newYear = new ExamYear({
      QPYear,
      catId: categoryId,
      subCatId: subcategoryId,
    });

    await newYear.save();
    res.status(201).json({ message: "Year added successfully", year: newYear });
  } catch (error) {
    console.error("Error adding year:", error);
    res.status(500).json({ error: "Error adding year" });
  }
};

const updateYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    const { QPYear } = req.body;
    const updatedYear = await ExamYear.findByIdAndUpdate(
      yearId,
      { QPYear },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Year updated successfully", year: updatedYear });
  } catch (error) {
    console.error("Error updating year:", error);
    res.status(500).json({ error: "Error updating year" });
  }
};

const removeYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    await ExamYear.findByIdAndDelete(yearId);
    res.status(200).json({ message: "Year deleted successfully" });
  } catch (error) {
    console.error("Error deleting year:", error);
    res.status(500).json({ error: "Error deleting year" });
  }
};

const getAllSubcatYear = async (req, res) => {
  try {
    const subcatYearData = await ExamYear.find()
      .populate("catId")
      .populate("subCatId");
    res.status(200).json(subcatYearData);
  } catch (error) {
    console.error("Error fetching subcategories and years:", error);
    res.status(500).json({ error: "Failed to fetch subcategories and years" });
  }
};

//subject
// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { subName } = req.body;
    const subject = new Subject({ subName });
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subject by ID
const updateSubject = async (req, res) => {
  try {
    const { subName } = req.body;
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subName },
      { new: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a subject by ID
const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new topic
const createTopic = async (req, res) => {
  try {
    const { topic, subjectID } = req.body;
    const newTopic = new Topic({ topic, subjectID });
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate("subjectID");
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get topics by subject ID
const getTopicsBySubjectId = async (req, res) => {
  try {
    const topics = await Topic.find({
      subjectID: req.params.subjectId,
    }).populate("subjectID");
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a topic by ID
const updateTopic = async (req, res) => {
  try {
    const { topic, subjectID } = req.body;
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      { topic, subjectID },
      { new: true }
    ).populate("subjectID");
    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a topic by ID
const deleteTopic = async (req, res) => {
  try {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = {
  createExamCategory,
  getExamCategories,
  deleteExamCategory,
  updateExamCategory,
  getAllSubCategories,
  findSubCategoriesByCategoryId,
  addSubcategory,
  updateSubcategory,
  removeSubcategory,
  getYearsBySubcategoryId,
  addYear,
  updateYear,
  removeYear,
  getAllSubcatYear,
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  createTopic,
  getAllTopics,
  getTopicsBySubjectId,
  updateTopic,
  deleteTopic,
  getCategoriesWithSubcategories,
  getCategoriesWithSubcategoriesAndYears,
  createExamEntry,
  removeYearWithPaper,
  removeSubcategoryWithYearsAndPapers,
  getCategoriesWithSubcategoriesAndYearsAndQuestionPaper,
  getAllUsers,
};
