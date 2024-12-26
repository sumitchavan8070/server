// // Import required modules
// const { fromPath } = require("pdf2pic");
// const fs = require("fs-extra");
// const path = require("path");
// const Tesseract = require("tesseract.js");

// // Path to the uploaded PDF file
// const pdfPath = "./test2.pdf";

// // Output file to save extracted text
// const outputFile = "./retrievedText.txt";

// // Directory to store images temporarily
// const tempDir = path.join(__dirname, "temp_images");

// // Function to ensure temporary directory exists
// fs.ensureDirSync(tempDir);

// // Function to convert PDF to images and extract text
// async function extractTextFromPDF() {
//   try {
//     console.log("Converting PDF to images...");

//     // Convert all pages of PDF to images
//     const pdf2pic = fromPath(pdfPath, {
//       density: 300,
//       saveFilename: "page",
//       savePath: tempDir,
//       format: "jpg",
//       width: 2480, // Width for A4 size at 300 DPI
//       height: 3508, // Height for A4 size at 300 DPI
//     });

//     const results = await pdf2pic.bulk(-1); // Convert all pages
//     console.log(`PDF successfully converted to ${results.length} images.`);

//     let extractedText = "";

//     console.log("Starting OCR process on each page...");

//     // Process each page
//     for (let result of results) {
//       console.log(`Processing ${result.name}...`);

//       const imagePath = result.path;
//       const ocrResult = await Tesseract.recognize(imagePath, "mar", {
//         logger: (info) => console.log(info), // Log progress
//       });

//       extractedText += ocrResult.data.text + "\n";
//     }

//     // Write the extracted text to a file
//     fs.writeFileSync(outputFile, extractedText, "utf8");
//     console.log(`Extracted text saved to ${outputFile}`);

//     // Clean up temporary images
//     fs.emptyDirSync(tempDir);
//     console.log("Temporary images cleaned up.");
//   } catch (error) {
//     console.error("Error during the process:", error);
//   }
// }

// // Start the process
// extractTextFromPDF();

// Import required modules
const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");
const Tesseract = require("tesseract.js");

// Path to the uploaded PDF file
const pdfPath = "./test3.pdf";

// Output file to save extracted text
const outputFile = "./retrievedText.txt";

// Directory to store images temporarily
const tempDir = path.join(__dirname, "temp_images");

// Variable to define the number of pages to process
const totalPages = 5; // Set this to the number of pages in your PDF

// Function to ensure temporary directory exists
fs.ensureDirSync(tempDir);

// Function to convert PDF to images and extract text
async function extractTextFromPDF() {
  try {
    console.log("Converting PDF to images...");

    // Convert specified number of pages of PDF to images
    const pdf2pic = fromPath(pdfPath, {
      density: 300,
      saveFilename: "page",
      savePath: tempDir,
      format: "jpg",
      width: 2480, // Width for A4 size at 300 DPI
      height: 3508, // Height for A4 size at 300 DPI
    });

    let extractedText = "";

    console.log("Starting OCR process on each page...");

    // Process each specified page
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      console.log(`Processing page ${pageNumber}...`);

      // Convert the specific page
      const result = await pdf2pic(pageNumber); // Correct function to convert a page
      const imagePath = result.path;

      const ocrResult = await Tesseract.recognize(imagePath, "mar", {
        logger: (info) => console.log(info), // Log progress
      });

      extractedText += ocrResult.data.text + "\n";
    }

    // Write the extracted text to a file
    fs.writeFileSync(outputFile, extractedText, "utf8");
    console.log(`Extracted text saved to ${outputFile}`);

    // Clean up temporary images
    fs.emptyDirSync(tempDir);
    console.log("Temporary images cleaned up.");
  } catch (error) {
    console.error("Error during the process:", error);
  }
}

// Start the process
extractTextFromPDF();

// Import required modules
// const { fromPath } = require("pdf2pic");
// const fs = require("fs-extra");
// const path = require("path");
// const Tesseract = require("tesseract.js");
// const sharp = require("sharp"); // For image manipulation

// // Path to the uploaded PDF file
// const pdfPath = "./test.pdf";

// // Output file to save extracted text
// const outputFile = "./retrievedText.txt";

// // Directory to store images temporarily
// const tempDir = path.join(__dirname, "temp_images");

// // Function to ensure temporary directory exists
// fs.ensureDirSync(tempDir);

// // Function to split image into two halves and perform OCR
// async function processImage(imagePath, side) {
//   try {
//     const buffer = fs.readFileSync(imagePath);
//     const { width, height } = await sharp(buffer).metadata();

//     // Determine crop dimensions for the side
//     const cropOptions =
//       side === "right"
//         ? { left: width / 2, top: 0, width: width / 2, height: height }
//         : { left: 0, top: 0, width: width / 2, height: height };

//     // Crop the image
//     const croppedBuffer = await sharp(buffer).extract(cropOptions).toBuffer();

//     // Save cropped image for debugging (optional)
//     const croppedPath = imagePath.replace(".jpg", `_${side}.jpg`);
//     fs.writeFileSync(croppedPath, croppedBuffer);

//     // Perform OCR on the cropped image
//     const ocrResult = await Tesseract.recognize(croppedBuffer, "mar", {
//       logger: (info) => console.log(info), // Log OCR progress
//     });

//     return ocrResult.data.text.trim();
//   } catch (error) {
//     console.error(`Error processing ${side} side of ${imagePath}:`, error);
//     return "";
//   }
// }

// // Function to convert PDF to images and extract text
// async function extractTextFromPDF() {
//   try {
//     console.log("Converting PDF to images...");

//     // Convert all pages of PDF to images
//     const pdf2pic = fromPath(pdfPath, {
//       density: 300,
//       saveFilename: "page",
//       savePath: tempDir,
//       format: "jpg",
//       width: 2480, // Width for A4 size at 300 DPI
//       height: 3508, // Height for A4 size at 300 DPI
//     });

//     const results = await pdf2pic.bulk(-1); // Convert all pages
//     console.log(`PDF successfully converted to ${results.length} images.`);

//     let extractedText = "";

//     console.log("Starting OCR process on each page...");

//     // Process each page
//     for (let result of results) {
//       console.log(`Processing ${result.name}...`);

//       const imagePath = result.path;

//       // Extract text from right side first, then left side
//       const rightText = await processImage(imagePath, "right");
//       const leftText = await processImage(imagePath, "left");

//       extractedText += rightText + "\n" + leftText + "\n";
//     }

//     // Write the extracted text to a file
//     fs.writeFileSync(outputFile, extractedText, "utf8");
//     console.log(`Extracted text saved to ${outputFile}`);

//     // Clean up temporary images
//     fs.emptyDirSync(tempDir);
//     console.log("Temporary images cleaned up.");
//   } catch (error) {
//     console.error("Error during the process:", error);
//   }
// }

// // Start the process
// extractTextFromPDF();
