// // const { fromPath } = require("pdf2pic");
// // const Tesseract = require("tesseract.js");
// // const XLSX = require("xlsx");
// // const fs = require("fs-extra");
// // const path = require("path");

// // const outputDir = path.join(__dirname, "..", "uploads", "images");
// // const outputTextPath = path.join(
// //   __dirname,
// //   "..",
// //   "uploads",
// //   "extractedText.txt"
// // );
// // const outputExcelPath = path.join(__dirname, "..", "uploads", "questions.xlsx");

// // const convertPdfToImages = async (pdfPath) => {
// //   const converter = fromPath(pdfPath, {
// //     density: 300,
// //     saveFilename: "image_",
// //     savePath: outputDir,
// //     format: "jpg",
// //     width: 2480,
// //     height: 3508,
// //     suffix: "",
// //   });

// //   return converter.bulk(-1);
// // };

// // const extractTextFromImage = async (imagePath) => {
// //   const {
// //     data: { text },
// //   } = await Tesseract.recognize(imagePath, "mar+eng");
// //   return text;
// // };

// // const filterDevanagariText = (text) => {
// //   const devanagariRegex = /[\u0900-\u097F]/g;
// //   const latinRegex = /[A-Za-z]/g;
// //   const lines = text.split("\n");
// //   const latinCharThreshold = 5;

// //   const filteredLines = lines.filter((line) => {
// //     const latinMatches = line.match(latinRegex) || [];
// //     return latinMatches.length <= latinCharThreshold;
// //   });

// //   return filteredLines.join("\n");
// // };

// // const appendTextToFile = (text, outputPath) => {
// //   fs.appendFileSync(outputPath, text + "\n");
// // };

// // const processImagesInDirectory = async (directoryPath, outputPath) => {
// //   const files = fs.readdirSync(directoryPath);

// //   files.sort((a, b) => {
// //     const numA = parseInt(a.match(/\d+/)[0], 10);
// //     const numB = parseInt(b.match(/\d+/)[0], 10);
// //     return numA - numB;
// //   });

// //   for (const file of files) {
// //     const filePath = path.join(directoryPath, file);
// //     const text = await extractTextFromImage(filePath);
// //     const filteredText = filterDevanagariText(text);
// //     appendTextToFile(filteredText, outputPath);
// //   }
// // };

// // const parseQuestionsFromText = (text) => {
// //   const lines = text.split("\n");
// //   const questions = [];
// //   let currentQuestion = { options: [] };
// //   let optionsStart = false;

// //   lines.forEach((line) => {
// //     if (/^\d+\./.test(line)) {
// //       if (currentQuestion.questionText) {
// //         questions.push(currentQuestion);
// //         currentQuestion = { options: [] };
// //       }
// //       currentQuestion.questionNo = line.match(/^\d+/)[0];
// //       currentQuestion.questionText = line;
// //       optionsStart = false;
// //     } else if (optionsStart || /^\(\d+\)/.test(line)) {
// //       optionsStart = true;
// //       currentQuestion.options.push(line.trim());
// //     } else {
// //       currentQuestion.questionText += " " + line;
// //     }
// //   });

// //   if (currentQuestion.questionText) {
// //     questions.push(currentQuestion);
// //   }

// //   return questions;
// // };

// // const splitOptions = (options) => {
// //   const splitOptions = [];
// //   options.forEach((option) => {
// //     const parts = option.split(/\s(?=\(\d+\))/);
// //     splitOptions.push(...parts);
// //   });
// //   return splitOptions;
// // };

// // const writeQuestionsToExcel = (questions, outputPath) => {
// //   const data = questions.map((question) => {
// //     const splitOptionsArr = splitOptions(question.options);
// //     return {
// //       QuestionNo: question.questionNo,
// //       QuestionText: question.questionText,
// //       Option1: splitOptionsArr[0] || "",
// //       Option2: splitOptionsArr[1] || "",
// //       Option3: splitOptionsArr[2] || "",
// //       Option4: splitOptionsArr[3] || "",
// //     };
// //   });
// //   const workbook = XLSX.utils.book_new();
// //   const worksheet = XLSX.utils.json_to_sheet(data);
// //   XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
// //   XLSX.writeFile(workbook, outputPath);
// // };

// // const generateExcelFromText = (inputTextPath, outputExcelPath) => {
// //   const data = fs.readFileSync(inputTextPath, "utf8");
// //   const questions = parseQuestionsFromText(data);
// //   writeQuestionsToExcel(questions, outputExcelPath);
// // };

// // const processPdf = async (req, res) => {
// //   try {
// //     const { file } = req;
// //     const pdfPath = file.path;

// //     // Step 1: Convert PDF to Images
// //     await convertPdfToImages(pdfPath);

// //     // Step 2: Extract Text from Images
// //     await processImagesInDirectory(outputDir, outputTextPath);

// //     // Step 3: Generate Excel from Text
// //     generateExcelFromText(outputTextPath, outputExcelPath);

// //     res.json({
// //       message: "PDF processing complete",
// //       extractedTextPath: outputTextPath,
// //       generatedExcelPath: outputExcelPath,
// //     });
// //   } catch (error) {
// //     console.log(error);

// //     res.status(500).json({ message: "Error processing PDF", error });
// //   }
// // };

// // module.exports = {
// //   processPdf,
// // };

// const { fromPath } = require("pdf2pic");
// const Tesseract = require("tesseract.js");
// const XLSX = require("xlsx");
// const fs = require("fs-extra");
// const path = require("path");

// const outputDir = path.join(__dirname, "..", "uploads", "images");
// const outputTextPath = path.join(
//   __dirname,
//   "..",
//   "uploads",
//   "extractedText.txt"
// );
// const outputExcelPath = path.join(__dirname, "..", "uploads", "questions.xlsx");

// // Ensure the output directory exists
// fs.ensureDirSync(outputDir);

// const convertPdfToImages = async (pdfPath) => {
//   const converter = fromPath(pdfPath, {
//     density: 300,
//     saveFilename: "image_",
//     savePath: outputDir,
//     format: "jpg",
//     width: 2480,
//     height: 3508,
//     suffix: "",
//   });

//   return converter.bulk(-1);
// };

// const extractTextFromImage = async (imagePath) => {
//   try {
//     const {
//       data: { text },
//     } = await Tesseract.recognize(imagePath, "mar+eng");
//     return text;
//   } catch (error) {
//     console.error(`Error extracting text from ${imagePath}:`, error);
//     return "";
//   }
// };

// const filterDevanagariText = (text) => {
//   const devanagariRegex = /[\u0900-\u097F]/g;
//   const latinRegex = /[A-Za-z]/g;
//   const lines = text.split("\n");
//   const latinCharThreshold = 5;

//   const filteredLines = lines.filter((line) => {
//     const latinMatches = line.match(latinRegex) || [];
//     return latinMatches.length <= latinCharThreshold;
//   });

//   return filteredLines.join("\n");
// };

// const appendTextToFile = (text, outputPath) => {
//   fs.appendFileSync(outputPath, text + "\n");
// };

// const processImagesInDirectory = async (directoryPath, outputPath) => {
//   try {
//     const files = fs.readdirSync(directoryPath);

//     files.sort((a, b) => {
//       const numA = parseInt(a.match(/\d+/)[0], 10);
//       const numB = parseInt(b.match(/\d+/)[0], 10);
//       return numA - numB;
//     });

//     for (const file of files) {
//       const filePath = path.join(directoryPath, file);
//       const text = await extractTextFromImage(filePath);
//       const filteredText = filterDevanagariText(text);
//       appendTextToFile(filteredText, outputPath);
//     }
//   } catch (error) {
//     console.error(
//       `Error processing images in directory ${directoryPath}:`,
//       error
//     );
//   }
// };

// const parseQuestionsFromText = (text) => {
//   const lines = text.split("\n");
//   const questions = [];
//   let currentQuestion = { options: [] };
//   let optionsStart = false;

//   lines.forEach((line) => {
//     if (/^\d+\./.test(line)) {
//       if (currentQuestion.questionText) {
//         questions.push(currentQuestion);
//         currentQuestion = { options: [] };
//       }
//       currentQuestion.questionNo = line.match(/^\d+/)[0];
//       currentQuestion.questionText = line;
//       optionsStart = false;
//     } else if (optionsStart || /^\(\d+\)/.test(line)) {
//       optionsStart = true;
//       currentQuestion.options.push(line.trim());
//     } else {
//       currentQuestion.questionText += " " + line;
//     }
//   });

//   if (currentQuestion.questionText) {
//     questions.push(currentQuestion);
//   }

//   return questions;
// };

// const splitOptions = (options) => {
//   const splitOptions = [];
//   options.forEach((option) => {
//     const parts = option.split(/\s(?=\(\d+\))/);
//     splitOptions.push(...parts);
//   });
//   return splitOptions;
// };

// const writeQuestionsToExcel = (questions, outputPath) => {
//   const data = questions.map((question) => {
//     const splitOptionsArr = splitOptions(question.options);
//     return {
//       QuestionNo: question.questionNo,
//       QuestionText: question.questionText,
//       Option1: splitOptionsArr[0] || "",
//       Option2: splitOptionsArr[1] || "",
//       Option3: splitOptionsArr[2] || "",
//       Option4: splitOptionsArr[3] || "",
//     };
//   });
//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
//   XLSX.writeFile(workbook, outputPath);
// };

// const generateExcelFromText = (inputTextPath, outputExcelPath) => {
//   try {
//     const data = fs.readFileSync(inputTextPath, "utf8");
//     const questions = parseQuestionsFromText(data);
//     writeQuestionsToExcel(questions, outputExcelPath);
//   } catch (error) {
//     console.error(
//       `Error generating Excel from text file ${inputTextPath}:`,
//       error
//     );
//   }
// };

// const processPdf = async (req, res) => {
//   try {
//     const { file } = req;
//     const pdfPath = file.path;

//     // Ensure the output directory exists
//     fs.ensureDirSync(outputDir);

//     // Step 1: Convert PDF to Images
//     await convertPdfToImages(pdfPath);

//     // Step 2: Extract Text from Images
//     await processImagesInDirectory(outputDir, outputTextPath);

//     // Step 3: Generate Excel from Text
//     generateExcelFromText(outputTextPath, outputExcelPath);

//     res.json({
//       message: "PDF processing complete",
//       extractedTextPath: outputTextPath,
//       generatedExcelPath: outputExcelPath,
//     });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     res.status(500).json({ message: "Error processing PDF", error });
//   }
// };

// module.exports = {
//   processPdf,
// };

const { fromPath } = require("pdf2pic");
const Tesseract = require("tesseract.js");
const XLSX = require("xlsx");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const app = express();

const outputDir = path.join(__dirname, "..", "uploads", "images");
const outputTextPath = path.join(
  __dirname,
  "..",
  "uploads",
  "extractedText.txt"
);
const outputExcelPath = path.join(__dirname, "..", "uploads", "questions.xlsx");

// Ensure the output directory exists
fs.ensureDirSync(outputDir);

const convertPdfToImages = async (pdfPath) => {
  const converter = fromPath(pdfPath, {
    density: 300,
    saveFilename: "image_",
    savePath: outputDir,
    format: "jpg",
    width: 2480,
    height: 3508,
    suffix: "",
  });

  return converter.bulk(-1);
};

const extractTextFromImage = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "mar+eng");
    return text;
  } catch (error) {
    console.error(`Error extracting text from ${imagePath}:`, error);
    return "";
  }
};

const filterDevanagariText = (text) => {
  const devanagariRegex = /[\u0900-\u097F]/g;
  const latinRegex = /[A-Za-z]/g;
  const lines = text.split("\n");
  const latinCharThreshold = 5;

  const filteredLines = lines.filter((line) => {
    const latinMatches = line.match(latinRegex) || [];
    return latinMatches.length <= latinCharThreshold;
  });

  return filteredLines.join("\n");
};

const appendTextToFile = (text, outputPath) => {
  fs.appendFileSync(outputPath, text + "\n");
};

const processImagesInDirectory = async (directoryPath, outputPath) => {
  try {
    const files = fs.readdirSync(directoryPath);

    files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const text = await extractTextFromImage(filePath);
      const filteredText = filterDevanagariText(text);
      appendTextToFile(filteredText, outputPath);
    }
  } catch (error) {
    console.error(
      `Error processing images in directory ${directoryPath}:`,
      error
    );
  }
};

const parseQuestionsFromText = (text) => {
  const lines = text.split("\n");
  const questions = [];
  let currentQuestion = { options: [] };
  let optionsStart = false;

  lines.forEach((line) => {
    if (/^\d+\./.test(line)) {
      if (currentQuestion.questionText) {
        questions.push(currentQuestion);
        currentQuestion = { options: [] };
      }
      currentQuestion.questionNo = line.match(/^\d+/)[0];
      currentQuestion.questionText = line;
      optionsStart = false;
    } else if (optionsStart || /^\(\d+\)/.test(line)) {
      optionsStart = true;
      currentQuestion.options.push(line.trim());
    } else {
      currentQuestion.questionText += " " + line;
    }
  });

  if (currentQuestion.questionText) {
    questions.push(currentQuestion);
  }

  return questions;
};

const splitOptions = (options) => {
  const splitOptions = [];
  options.forEach((option) => {
    const parts = option.split(/\s(?=\(\d+\))/);
    splitOptions.push(...parts);
  });
  return splitOptions;
};

const writeQuestionsToExcel = (questions, outputPath) => {
  const data = questions.map((question) => {
    const splitOptionsArr = splitOptions(question.options);
    return {
      QuestionNo: question.questionNo,
      question: question.questionText,
      option1: splitOptionsArr[0] || "",
      option2: splitOptionsArr[1] || "",
      option3: splitOptionsArr[2] || "",
      option4: splitOptionsArr[3] || "",
    };
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  XLSX.writeFile(workbook, outputPath);
};

const generateExcelFromText = (inputTextPath, outputExcelPath) => {
  try {
    const data = fs.readFileSync(inputTextPath, "utf8");
    const questions = parseQuestionsFromText(data);
    writeQuestionsToExcel(questions, outputExcelPath);
  } catch (error) {
    console.error(
      `Error generating Excel from text file ${inputTextPath}:`,
      error
    );
  }
};

const cleanUpFiles = () => {
  fs.removeSync(outputDir);
  fs.removeSync(outputTextPath);
  fs.removeSync(outputExcelPath);
};

// const processPdf = async (req, res) => {
//   try {
//     const { file } = req;
//     const pdfPath = file.path;

//     // Ensure the output directory exists
//     fs.ensureDirSync(outputDir);

//     // Step 1: Convert PDF to Images
//     await convertPdfToImages(pdfPath);

//     // Step 2: Extract Text from Images
//     await processImagesInDirectory(outputDir, outputTextPath);

//     // Step 3: Generate Excel from Text
//     generateExcelFromText(outputTextPath, outputExcelPath);

//     // Clean up temporary files and directories
//     cleanUpFiles();

//     // Send file paths in the JSON response
//     res.json({
//       message: "PDF processing complete",
//       extractedText: fs.readFileSync(outputTextPath, "utf8"),
//       extractedTextPath: `/downloads/${path.basename(outputTextPath)}`,
//       generatedExcelPath: `/downloads/${path.basename(outputExcelPath)}`,
//     });
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     res.status(500).json({ message: "Error processing PDF", error });
//   }
// };

// const processPdf = async (req, res) => {
//   let responseSent = false;

//   try {
//     const { file } = req;
//     const pdfPath = file.path;

//     // Ensure the output directory exists
//     fs.ensureDirSync(outputDir);

//     // Step 1: Convert PDF to Images
//     await convertPdfToImages(pdfPath);

//     // Step 2: Extract Text from Images
//     await processImagesInDirectory(outputDir, outputTextPath);

//     // Step 3: Generate Excel from Text
//     generateExcelFromText(outputTextPath, outputExcelPath);

//     // Prepare response
//     const response = {
//       message: "PDF processing complete",
//       extractedText: fs.readFileSync(outputTextPath, "utf8"),
//       extractedTextPath: `/downloads/${path.basename(outputTextPath)}`,
//       generatedExcelPath: `/downloads/${path.basename(outputExcelPath)}`,
//     };

//     // Send response
//     res.json(response);
//     responseSent = true;
//   } catch (error) {
//     console.error("Error processing PDF:", error);
//     if (!responseSent) {
//       res.status(500).json({ message: "Error processing PDF", error });
//     }
//   } finally {
//     // Clean up files after sending response
//     cleanUpFiles();
//   }
// };

const processPdf = async (req, res) => {
  let responseSent = false;

  try {
    const { file } = req;
    const pdfPath = file.path;

    // Ensure the output directory exists
    fs.ensureDirSync(outputDir);

    // Step 1: Convert PDF to Images
    await convertPdfToImages(pdfPath);

    // Step 2: Extract Text from Images
    await processImagesInDirectory(outputDir, outputTextPath);

    // Step 3: Generate Excel from Text
    generateExcelFromText(outputTextPath, outputExcelPath);

    // Read extracted text and generate JSON from Excel
    const extractedText = fs.readFileSync(outputTextPath, "utf8");

    const workbook = XLSX.readFile(outputExcelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Prepare response
    const response = {
      message: "PDF processing complete",
      extractedText,
      extractedTextPath: `/downloads/${path.basename(outputTextPath)}`,
      generatedExcelPath: `/downloads/${path.basename(outputExcelPath)}`,
      questionsJson: jsonData,
    };

    // Send response
    res.json(response);
    responseSent = true;
  } catch (error) {
    console.error("Error processing PDF:", error);
    if (!responseSent) {
      res.status(500).json({ message: "Error processing PDF", error });
    }
  } finally {
    // Clean up files after sending response
    cleanUpFiles();
  }
};

// Set up static file serving for download links
app.use("/downloads", express.static(path.join(__dirname, "..", "uploads")));

module.exports = {
  processPdf,
};
