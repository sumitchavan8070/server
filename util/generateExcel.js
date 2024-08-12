// const fs = require("fs");
// const XLSX = require("xlsx");

// // Function to parse questions and options from text
// const parseQuestionsFromText = (text) => {
//   const lines = text.split("\n");
//   const questions = [];
//   let currentQuestion = {
//     options: [],
//   };
//   let optionsStart = false;

//   lines.forEach((line) => {
//     if (/^\d+\./.test(line)) {
//       if (currentQuestion.questionText) {
//         questions.push(currentQuestion);
//         currentQuestion = {
//           options: [],
//         };
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

// // Function to write questions and options to an Excel file
// const writeQuestionsToExcel = (questions, outputPath) => {
//   const data = questions.map((question) => ({
//     QuestionNo: question.questionNo,
//     QuestionText: question.questionText,
//     Option1: question.options[0] || "",
//     Option2: question.options[1] || "",
//     Option3: question.options[2] || "",
//     Option4: question.options[3] || "",
//   }));

//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
//   XLSX.writeFile(workbook, outputPath);
//   console.log("Questions written to Excel file successfully.");
// };

// // Function to read text from file and generate Excel
// const generateExcelFromText = (inputTextPath, outputExcelPath) => {
//   fs.readFile(inputTextPath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading text file:", err);
//     } else {
//       const questions = parseQuestionsFromText(data);
//       writeQuestionsToExcel(questions, outputExcelPath);
//     }
//   });
// };

// // Define file paths
// const inputTextPath = "/home/sumit/Project/App/server/util/extractedText.txt";
// const outputExcelPath = "/home/sumit/Project/App/server/util/questions.xlsx";

// // Generate Excel from text
// generateExcelFromText(inputTextPath, outputExcelPath);

const fs = require("fs");
const XLSX = require("xlsx");

// Function to parse questions and options from text
const parseQuestionsFromText = (text) => {
  const lines = text.split("\n");
  const questions = [];
  let currentQuestion = {
    options: [],
  };
  let optionsStart = false;

  lines.forEach((line) => {
    if (/^\d+\./.test(line)) {
      if (currentQuestion.questionText) {
        questions.push(currentQuestion);
        currentQuestion = {
          options: [],
        };
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

// Function to split options correctly
const splitOptions = (options) => {
  const splitOptions = [];
  options.forEach((option) => {
    const parts = option.split(/\s(?=\(\d+\))/); // Split on spaces before option numbers
    splitOptions.push(...parts);
  });
  return splitOptions;
};

// Function to write questions and options to an Excel file
const writeQuestionsToExcel = (questions, outputPath) => {
  const data = questions.map((question) => {
    const splitOptionsArr = splitOptions(question.options);
    return {
      QuestionNo: question.questionNo,
      QuestionText: question.questionText,
      Option1: splitOptionsArr[0] || "",
      Option2: splitOptionsArr[1] || "",
      Option3: splitOptionsArr[2] || "",
      Option4: splitOptionsArr[3] || "",
    };
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  XLSX.writeFile(workbook, outputPath);
  console.log("Questions written to Excel file successfully.");
};

// Function to read text from file and generate Excel
const generateExcelFromText = (inputTextPath, outputExcelPath) => {
  fs.readFile(inputTextPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading text file:", err);
    } else {
      const questions = parseQuestionsFromText(data);
      writeQuestionsToExcel(questions, outputExcelPath);
    }
  });
};

// Define file paths
const inputTextPath = "/home/sumit/Project/App/server/util/extractedText.txt";
const outputExcelPath = "/home/sumit/Project/App/server/util/questions.xlsx";

// Generate Excel from text
generateExcelFromText(inputTextPath, outputExcelPath);
