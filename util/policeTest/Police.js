const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");
const Tesseract = require("tesseract.js");
const sharp = require("sharp"); // For image manipulation

// Path to the uploaded PDF file
const pdfPath = "./a.pdf";

// Output file to save extracted text
const outputFile = "./retrievedText.txt";

// Directory to store images temporarily
const tempDir = path.join(__dirname, "temp_images");

// Function to ensure temporary directory exists
fs.ensureDirSync(tempDir);

// Function to process and enhance an image for OCR
async function processImage(imagePath, side) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const { width, height } = await sharp(buffer).metadata();

    // Determine crop dimensions for the side
    const cropOptions =
      side === "right"
        ? { left: width / 2, top: 0, width: width / 2, height: height }
        : { left: 0, top: 0, width: width / 2, height: height };

    // Crop the image
    const croppedBuffer = await sharp(buffer)
      .extract(cropOptions) // Crop to the required side
      .resize({
        width: Math.floor((width / 2) * 2), // Dynamically upscale for better readability
        height: Math.floor(height * 2),
      })
      .toBuffer();

    // Preprocess the cropped image
    const preprocessedBuffer = await sharp(croppedBuffer)
      .grayscale() // Convert to grayscale
      .blur(1) // Apply slight Gaussian blur to reduce noise
      .normalize() // Normalize brightness and contrast
      .threshold(128, { greyscale: true }) // Apply adaptive thresholding
      .modulate({ contrast: 2.0 }) // Increase contrast
      .sharpen() // Sharpen text edges
      .toBuffer();

    // Save preprocessed image for debugging (optional)
    const preprocessedPath = imagePath.replace(
      ".jpg",
      `_${side}_processed.jpg`
    );
    fs.writeFileSync(preprocessedPath, preprocessedBuffer);

    // Perform OCR on the preprocessed image
    const ocrResult = await Tesseract.recognize(preprocessedBuffer, "mar", {
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

    console.log("Starting OCR process on each page...");

    // Process each page
    for (let result of results) {
      console.log(`Processing ${result.name}...`);

      const imagePath = result.path;

      // Extract text from the left side first, then right side
      const leftText = await processImage(imagePath, "left");
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
