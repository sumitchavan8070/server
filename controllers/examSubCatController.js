const { Error } = require("mongoose");
const SubExamCategory = require("../models/examSubCategoryModel");
const ExamCategory = require("../models/examCategoryModel");
const ExamYear = require("../models/examYearModel");

const createSubExamCat = async (req, res) => {
  try {
    const subCatName = req.body.subCatName;
    const catName = req.body.catName;

    const checkCatName = await ExamCategory.findOne({ catName });
    const data = await SubExamCategory.find({ subCatName, catName });

    // if (category_name && sub_category_name) {
    //   throw new Error(
    //     `Category Name : ${category_name.catName}  && Sub-Cat Name : ${sub_category_name.subCatName}  is Already Exist`
    //   );
    // }
    if (data.length > 0) {
      throw new Error("Data is Already Exist");
    }

    //Check Category Name is Valid or not

    if (!checkCatName) {
      throw new Error("Invalid Category Name");
    }

    const subExamCat = new SubExamCategory({
      subCatName,
      catName,
    });

    const subCatData = await subExamCat.save();

    res.status(201).send({
      success: true,
      message: "Sub Category Added Successfully",
      data: subCatData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getSubCategoryOfCategory = async (req, res) => {
  try {
    console.log("Im here");

    // const catId = req.query._id;
    const checkCategoryPresence = await SubExamCategory.find({});
    // console.log("Length" + checkCategoryPresence.length);

    if (!checkCategoryPresence || checkCategoryPresence.length === 0) {
      throw new Error(`Sub Category is Not Present`);
    }

    res.status(200).send({
      success: true,
      message: `Sub Category is Displayed`,
      data: checkCategoryPresence,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// const getSubCategoryOfCategory = async (req, res) => {
//   try {
//     const catName = req.query.catName; // Use req.query instead of req.body

//     if (!catName) {
//       throw new Error("catName parameter is required");
//     }

//     const checkCategoryPresence = await SubExamCategory.find({ catName });

//     if (!checkCategoryPresence || checkCategoryPresence.length === 0) {
//       throw new Error(`catName: ${catName} is Not Present`);
//     }

//     res.status(200).send({
//       success: true,
//       message: `Sub Category of the ${catName} is Displayed`,
//       data: checkCategoryPresence,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const addYear = async (req, res) => {
  try {
    const catName = req.body.catName;
    const subCatName = req.body.subCatName;
    const QPYear = req.body.QPYear;

    const data = await ExamYear.find({ QPYear, subCatName, catName });
    const checkCatName = await ExamCategory.findOne({ catName });
    const checkSubCatName = await SubExamCategory.findOne({ subCatName });

    // console.log("data....." + data.length);

    // Check data is exist or not
    if (data.length > 0) {
      throw new Error("Data is Already Exist");
    }

    //check cat name is valid or not

    if (!checkCatName) {
      throw new Error("Invalid Category Name");
    }

    //check Sub category name is valid or not
    if (!checkSubCatName) {
      throw new Error("Invalid Sub - Cat Category Name");
    }

    const examYear = new ExamYear({
      QPYear,
      catName,
      subCatName,
    });

    const updatedData = await examYear.save();

    res.status(201).send({
      success: true,
      message: "Year is Created",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getYearData = async (req, res) => {
  try {
    const catName = req.body.catName;
    const subCatName = req.body.subCatName;
    const QPYear = req.body.QPYear;

    //return only if sub cat and cat provided
    if (!QPYear && subCatName && catName) {
      const data = await ExamYear.find({ subCatName, catName });
      if (data.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Data not found",
        });
      }
      return res.status(200).send({
        success: true,
        message: `Year Data Displayed on the basis of ${subCatName} and ${catName}`,
        data: data,
      });
    }

    //return only if year and cat provided
    if (!subCatName && QPYear && catName) {
      const data = await ExamYear.find({ QPYear, catName });
      if (data.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Data not found",
        });
      }

      return res.status(200).send({
        success: true,
        message: `Year Data Displayed on the basis of ${QPYear} and ${catName}`,
        data: data,
      });
    }

    // if all values are provide then send this res
    if (QPYear && catName && subCatName) {
      const data = await ExamYear.find({ QPYear, subCatName, catName });
      if (data.length === 0) {
        return res.status(404).send({
          success: false,

          message: "Data not found",
        });
      }
      return res.status(200).send({
        success: true,
        message: `Year Data Displayed on the basis of ${QPYear} and ${catName} and ${subCatName}`,
        data: data,
      });
    }

    if (QPYear && !catName && !subCatName) {
      const data = await ExamYear.find({ QPYear });
      if (data.length === 0) {
        return res.status(404).send({
          success: false,

          message: "Data not found",
        });
      }
      return res.status(200).send({
        success: true,
        message: `Year Data Displayed on the basis of ${QPYear} `,
        data: data,
      });
    }

    if (!QPYear && catName && !subCatName) {
      const data = await ExamYear.find({ catName });
      if (data.length === 0) {
        return res.status(404).send({
          success: false,

          message: "Data not found",
        });
      }
      return res.status(200).send({
        success: true,
        message: `Year Data Displayed on the basis of ${catName} `,
        data: data,
      });
    }

    throw new Error(
      "Something went wrong in get year data method - exam sub controller"
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAllYear = async (req, res) => {
  try {
    const data = await ExamYear.find({});
    if (data) {
      return res.status(200).send({
        success: true,
        message: "Year Data Displayed",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubExamCat,
  getSubCategoryOfCategory,
  addYear,
  getYearData,
  getAllYear,
};
