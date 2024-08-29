// const Tesseract = require("tesseract.js");
// const XLSX = require("xlsx");
// const fs = require("fs-extra");
// const path = require("path");

// // Function to process image and extract text
// async function processImageToText(imagePath) {
//   return new Promise((resolve, reject) => {
//     Tesseract.recognize(imagePath, "eng", {
//       logger: (m) => console.log(m),
//     })
//       .then(({ data: { text } }) => {
//         resolve(text);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

// // Function to parse the text into a JSON structure
// function parseTextToJson(text) {
//   const lines = text.split("\n").filter((line) => line.trim());
//   const jsonData = [];
//   let headers = [];

//   lines.forEach((line, index) => {
//     const columns = line.split(/\s+/); // Split by whitespace

//     // First line would be treated as headers
//     if (index === 0) {
//       headers = columns;
//     } else {
//       const row = {};
//       headers.forEach((header, i) => {
//         row[header] = columns[i] || "";
//       });
//       jsonData.push(row);
//     }
//   });

//   return jsonData;
// }

// // Function to convert JSON to Excel
// function jsonToExcel(jsonData, outputExcelPath) {
//   const ws = XLSX.utils.json_to_sheet(jsonData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//   XLSX.writeFile(wb, outputExcelPath);
// }

// // Main function
// async function main() {
//   const imagePath = path.join(
//     __dirname,
//     "/mnt/data/DocScanner 18 Aug 2024 3-18 pm.jpg"
//   );
//   const outputJsonPath = path.join(__dirname, "output.json");
//   const outputExcelPath = path.join(__dirname, "output.xlsx");

//   try {
//     // Step 1: OCR process
//     console.log("Processing image...");
//     const extractedText = await processImageToText(imagePath);

//     // Step 2: Parse extracted text to JSON
//     console.log("Parsing text to JSON...");
//     const jsonData = parseTextToJson(extractedText);

//     // Step 3: Save JSON data to a file
//     console.log("Saving JSON data...");
//     await fs.writeJson(outputJsonPath, jsonData, { spaces: 2 });
//     console.log(`JSON saved to ${outputJsonPath}`);

//     // Step 4: Convert JSON to Excel
//     console.log("Converting JSON to Excel...");
//     jsonToExcel(jsonData, outputExcelPath);
//     console.log(`Excel saved to ${outputExcelPath}`);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // Run the main function
// main();

// i have this image , im writing nodejs program to convert image to excel , as you can see there are some columns and rows with values ... i want that do the ocr with tessaract and find and convert it to json object as per the index row and finally convert it to downloadable excel ... write file for me which i can execute in node js .. which will take a image input and provide me json file and excel file as in image

const Tesseract = require("tesseract.js");
const XLSX = require("xlsx");
const fs = require("fs-extra");
const path = require("path");

// Function to process image and extract text
async function processImageToText(imagePath) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Function to parse the text into a JSON structure
function parseTextToJson(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  const jsonData = [];
  let headers = [];

  lines.forEach((line, index) => {
    const columns = line.split(/\s+/); // Split by whitespace

    // First line would be treated as headers
    if (index === 0) {
      headers = columns;
    } else {
      const row = {};
      headers.forEach((header, i) => {
        row[header] = columns[i] || "";
      });
      jsonData.push(row);
    }
  });

  return jsonData;
}

// Function to convert JSON to Excel
function jsonToExcel(jsonData, outputExcelPath) {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, outputExcelPath);
}

// Main function
async function main() {
  // Hardcoded absolute path to the image
  const imagePath =
    "/home/sumit/Project/App/server/util/DocScanner 18 Aug 2024 3-18 pm.jpg";
  const outputJsonPath = path.join(__dirname, "output.json");
  const outputExcelPath = path.join(__dirname, "output.xlsx");

  try {
    // Step 1: OCR process
    console.log(`Processing image from path: ${imagePath}`);
    const extractedText = await processImageToText(imagePath);

    // Step 2: Parse extracted text to JSON
    console.log("Parsing text to JSON...");
    const jsonData = parseTextToJson(extractedText);

    // Step 3: Save JSON data to a file
    console.log("Saving JSON data...");
    await fs.writeJson(outputJsonPath, jsonData, { spaces: 2 });
    console.log(`JSON saved to ${outputJsonPath}`);

    // Step 4: Convert JSON to Excel
    console.log("Converting JSON to Excel...");
    jsonToExcel(jsonData, outputExcelPath);
    console.log(`Excel saved to ${outputExcelPath}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function
main();
