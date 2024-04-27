const { Error } = require("mongoose");
const ExamCategory = require("../models/examCategoryModel");

const createExamCat = async (req, res) => {
  try {
    const cat_name = req.body.catName;

    //Check Category Name is Already Exist in Database or not
    const category_name = await ExamCategory.findOne({ cat_name });

    const examCategory = new ExamCategory({
      catName: req.body.catName,
    });

    const exam_cat_data = await examCategory.save();

    res.status(201).send({
      success: true,
      message: "Category is added successfully",
      data: exam_cat_data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAllExamCategoryList = async (req, res) => {
  try {
    const allExams = await ExamCategory.find({});

    res.status(201).send({
      success: true,
      message: "All Categories are displayed successfully",
      data: allExams,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getSelectedExamPage = async (req, res) => {
  try {
    const catName = req.body.catName;
    const result = await ExamCategory.findOne({ catName });
    // console.log("result" + result);
    if (result === null) {
      throw new Error("Please Provide Valid Category Name");
    }
    res.status(200).send({
      success: true,
      message: "Exam is Displayed",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExamCat,
  getAllExamCategoryList,
  getSelectedExamPage,
};
