// const { fromPath } = require("pdf2pic");
// const fs = require("fs-extra");
// const path = require("path");
// const Tesseract = require("tesseract.js");
// const sharp = require("sharp"); // For cropping

// // Path to the uploaded PDF file
// const pdfPath = "./Navi.pdf";

// // Output file to save extracted text
// const outputFile = "./retrievedText.txt";

// // Directory to store images temporarily
// const tempDir = path.join(__dirname, "temp_images");

// // Function to ensure temporary directory exists
// fs.ensureDirSync(tempDir);

// // Function to extract text from a specific side of an image
// async function processImage(imagePath, side) {
//   try {
//     const buffer = fs.readFileSync(imagePath);
//     const { width, height } = await sharp(buffer).metadata();

//     // Determine crop dimensions for the side
//     const cropOptions =
//       side === "right"
//         ? { left: width / 2, top: 0, width: width / 2, height: height }
//         : { left: 0, top: 0, width: width / 2, height: height };

//     // Crop the image to the required side
//     const croppedBuffer = await sharp(buffer).extract(cropOptions).toBuffer();

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
//       density: 300, // High DPI for better quality
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

//       // Extract text from the left side
//       const leftText = await processImage(imagePath, "left");

//       // Extract text from the right side
//       const rightText = await processImage(imagePath, "right");

//       extractedText += leftText + "\n" + rightText + "\n";
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
const sharp = require("sharp"); // For cropping

// Path to the uploaded PDF file
const pdfPath = "./Ahilyanagar (Ahemadnagar) 2024.pdf";

// Output file to save extracted text
const outputFile = "./retrievedText.txt";

// Directory to store images temporarily
const tempDir = path.join(__dirname, "temp_images");

// Function to ensure temporary directory exists
fs.ensureDirSync(tempDir);

// Function to extract text from a specific side of an image
async function processImage(imagePath, side) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const { width, height } = await sharp(buffer).metadata();

    // Determine crop dimensions for the side
    const cropOptions =
      side === "right"
        ? { left: width / 2, top: 0, width: width / 2, height: height }
        : { left: 0, top: 0, width: width / 2, height: height };

    // Crop the image to the required side
    const croppedBuffer = await sharp(buffer).extract(cropOptions).toBuffer();

    // Perform OCR on the cropped image
    const ocrResult = await Tesseract.recognize(croppedBuffer, "mar", {
      logger: (info) => console.log(info), // Log OCR progress
    });

    return ocrResult.data.text.trim();
  } catch (error) {
    console.error(`Error processing ${side} side of ${imagePath}:`, error);
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

    console.log("Sorting and starting OCR process on each page...");

    // Sort images based on filename (assuming filenames follow page numbering like page.1.jpg, page.2.jpg, ...)
    results.sort((a, b) => {
      const pageA = parseInt(a.name.match(/(\d+)/)[0], 10);
      const pageB = parseInt(b.name.match(/(\d+)/)[0], 10);
      return pageA - pageB;
    });

    // Process each page in sequence
    for (let result of results) {
      console.log(`Processing ${result.name}...`);

      const imagePath = result.path;

      // Extract text from the left side
      const leftText = await processImage(imagePath, "left");

      // Extract text from the right side
      const rightText = await processImage(imagePath, "right");

      extractedText += leftText + "\n" + rightText + "\n";
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
