// const { fromPath } = require("pdf2pic");
// const fs = require("fs-extra");
// const path = require("path");
// const Tesseract = require("tesseract.js");

// // Path to the uploaded PDF file
// const pdfPath = "./c.pdf";

// // Output file to save extracted text
// const outputFile = "./retrievedText.txt";

// // Directory to store images temporarily
// const tempDir = path.join(__dirname, "temp_images");

// // Function to ensure temporary directory exists
// fs.ensureDirSync(tempDir);

// // Function to extract text from a full page image
// async function processImage(imagePath) {
//   try {
//     const buffer = fs.readFileSync(imagePath);

//     // Perform OCR on the full image
//     const ocrResult = await Tesseract.recognize(buffer, "mar", {
//       logger: (info) => console.log(info), // Log OCR progress
//     });

//     return ocrResult.data.text.trim();
//   } catch (error) {
//     console.error(`Error processing ${imagePath}:`, error);
//     return "";
//   }
// }

// // Function to convert PDF to images and extract text
// async function extractTextFromPDF() {
//   try {
//     console.log("Converting PDF to images...");

//     // Convert all pages of PDF to images
//     const pdf2pic = fromPath(pdfPath, {
//       density: 600, // High DPI for better quality
//       saveFilename: "page",
//       savePath: tempDir,
//       format: "jpg",
//       width: 4960, // Ultra-high resolution
//       height: 7016,
//     });

//     const results = await pdf2pic.bulk(-1); // Convert all pages
//     console.log(`PDF successfully converted to ${results.length} images.`);

//     let extractedText = "";

//     console.log("Starting OCR process on each page...");

//     // Process each page
//     for (let result of results) {
//       console.log(`Processing ${result.name}...`);

//       const imagePath = result.path;

//       // Extract text from the full page
//       const pageText = await processImage(imagePath);

//       extractedText += pageText + "\n";
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

const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");
const Tesseract = require("tesseract.js");
const sharp = require("sharp"); // For image preprocessing

// Path to the uploaded PDF file
const pdfPath = "./c.pdf";

// Output file to save extracted text
const outputFile = "./retrievedText.txt";

// Directory to store images temporarily
const tempDir = path.join(__dirname, "temp_images");

// Function to ensure temporary directory exists
fs.ensureDirSync(tempDir);

// Function to preprocess and extract text from an image
// async function processImage(imagePath) {
//   try {
//     // Read the image file
//     const buffer = fs.readFileSync(imagePath);

//     // Preprocess the image for better OCR accuracy
//     const preprocessedBuffer = await sharp(buffer)
//       .grayscale() // Convert to grayscale
//       .normalize() // Enhance contrast
//       .sharpen({ sigma: 2 }) // Increase sharpness further
//       .toBuffer();

//     // Perform OCR on the preprocessed image
//     const ocrResult = await Tesseract.recognize(preprocessedBuffer, "eng+mar", {
//       logger: (info) => console.log(info), // Log OCR progress
//     });

//     return ocrResult.data.text.trim();
//   } catch (error) {
//     console.error(`Error processing ${imagePath}:`, error);
//     return "";
//   }
// }
async function processImage(imagePath) {
  try {
    // Read the image file
    const buffer = fs.readFileSync(imagePath);

    // Preprocess the image for better OCR accuracy
    const preprocessedBuffer = await sharp(buffer)
      .grayscale() // Convert to grayscale
      .normalize() // Enhance contrast
      .sharpen({ sigma: 1.5 }) // Sharpen edges
      .threshold(200) // Binarize image
      .toBuffer();

    // Perform OCR using both English and Marathi
    // const ocrResult = await Tesseract.recognize(preprocessedBuffer, "eng+mar", {
    //   logger: (info) => console.log(info), // Log OCR progress
    //   tessedit_char_whitelist:
    //     "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzअआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसहािीुूेैोौ््ंः", // Include both English and Marathi characters
    // });
    const ocrResult = await Tesseract.recognize(preprocessedBuffer, "eng+mar", {
      logger: (info) => console.log(info),
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzअआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसहािीुूेैोौ््ंः()-.?*+",
      psm: 6, // Suitable for blocks of text
    });

    return ocrResult.data.text.trim();
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    return "";
  }
}

// Function to convert PDF to images and extract text
async function extractTextFromPDF() {
  try {
    console.log("Converting PDF to images...");

    // Convert all pages of PDF to images
    const pdf2pic = fromPath(pdfPath, {
      density: 300, // High DPI for better quality
      saveFilename: "page",
      savePath: tempDir,
      format: "jpg",
      width: 4960, // Ultra-high resolution
      height: 7016,
    });

    const results = await pdf2pic.bulk(-1); // Convert all pages
    console.log(`PDF successfully converted to ${results.length} images.`);

    let extractedText = "";

    console.log("Starting OCR process on each page...");

    // Process each page
    for (let result of results) {
      console.log(`Processing ${result.name}...`);

      const imagePath = result.path;

      // Preprocess and extract text from the full page
      const pageText = await processImage(imagePath);

      extractedText += pageText + "\n";
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
