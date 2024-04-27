const CustomTest = require("../models/CustomTestModel");

exports.createCustomTest = async (req, res) => {
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

    const customTest = new CustomTest({
      testId: TestId,
      testName,
      totalQuestions,
      passingMarks,
      creatorId,
      questions: questionsData,
    });

    // const savedTest = await customTest.save();
    // console.log("savedTest -------" + JSON.stringify(savedTest));

    // res.status(201).json({
    //   success: true,
    //   data: savedTest,
    // });
    const savedTest = await customTest.save();
    console.log("savedTest -------" + JSON.stringify(savedTest));

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

// @desc    Get all custom tests
// @route   GET /api/custom-tests
// @access  Public
exports.getAllCustomTests = async (req, res) => {
  try {
    const customTests = await CustomTest.find();

    res.status(200).json({
      success: true,
      data: customTests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get custom test by ID
// @route   GET /api/custom-tests/:id
// @access  Public
exports.getCustomTestById = async (req, res) => {
  try {
    const testId = req.params.id;
    // console.log("testid " + JSON.stringify(testId));
    const customTest = await CustomTest.find({ testId });

    if (!customTest) {
      return res.status(404).json({
        success: false,
        message: "Custom test not found",
      });
    }

    if (customTest.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Whoops! Test not found. Please double-check that your test code is correct and try again",
      });
    }

    res.status(200).json({
      success: true,
      data: customTest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update custom test by ID
// @route   PUT /api/custom-tests/:id
// @access  Public
exports.updateCustomTest = async (req, res) => {
  try {
    const {
      testId,
      testName,
      totalQuestions,
      passingMarks,
      creatorId,
      questions,
    } = req.body;

    const customTest = await CustomTest.findByIdAndUpdate(
      req.params.id,
      {
        testId,
        testName,
        totalQuestions,
        passingMarks,
        creatorId,
        questions,
      },
      { new: true, runValidators: true }
    );

    if (!customTest) {
      return res.status(404).json({
        success: false,
        error: "Custom test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customTest,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete custom test by ID
// @route   DELETE /api/custom-tests/:id
// @access  Public
exports.deleteCustomTest = async (req, res) => {
  try {
    const customTest = await CustomTest.findById(req.params.id);

    if (!customTest) {
      return res.status(404).json({
        success: false,
        error: "Custom test not found",
      });
    }

    await customTest.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
