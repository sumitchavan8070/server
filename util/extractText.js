const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

// Function to extract text from an image
// const extractTextFromImage = async (imagePath) => {
//   try {
//     const {
//       data: { text },
//     } = await Tesseract.recognize(
//       imagePath,
//       "mar+eng", // Language codes for Marathi and English
//       {
//         // logger: (m) => console.log(m),
//       }
//     );
//     return text;
//   } catch (error) {
//     console.error("Error extracting text:", error);
//     return null;
//   }
// };

const extractTextFromImage = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(
      imagePath,
      "mar+eng", // Language codes for Marathi and English
      {
        // logger: (m) => console.log(m),
      }
    );

    // Define a regular expression to match Roman numerals
    const romanNumeralsRegex =
      /\bM{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/gi;
    const romanNumerals = text.match(romanNumeralsRegex);

    // If there are Roman numerals, append them to the text
    if (romanNumerals) {
      const uniqueRomanNumerals = [...new Set(romanNumerals)]; // Remove duplicates
      const romanText = uniqueRomanNumerals.join(" ");
      return `${text} ${romanText}`;
    }

    return text;
  } catch (error) {
    console.error("Error extracting text:", error);
    return null;
  }
};

// Function to filter out non-Devanagari text
const filterDevanagariText = (text) => {
  // Regular expressions to match Devanagari and Latin characters
  const devanagariRegex = /[\u0900-\u097F]/g;
  const latinRegex = /[A-Za-z]/g;

  // Split the text by lines
  const lines = text.split("\n");

  // Define a threshold for the number of Latin characters to identify English text
  const latinCharThreshold = 5;

  // Filter lines that contain primarily Devanagari characters
  const filteredLines = lines.filter((line) => {
    const latinMatches = line.match(latinRegex) || [];
    // Exclude lines with more than the threshold of Latin characters
    return latinMatches.length <= latinCharThreshold;
  });

  // Join the filtered lines back into a single string
  return filteredLines.join("\n");
};

// Function to append text to a file
const appendTextToFile = (text, outputPath) => {
  fs.appendFile(outputPath, text + "\n", (err) => {
    if (err) {
      console.error("Error appending to file:", err);
    } else {
      console.log("Text appended to file successfully.");
    }
  });
};

// Function to process all images in a directory
const processImagesInDirectory = async (directoryPath, outputPath) => {
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Sort files numerically based on the number in the filename
    files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const text = await extractTextFromImage(filePath);
      if (text) {
        const filteredText = filterDevanagariText(text);
        appendTextToFile(filteredText, outputPath);
      } else {
        console.log(`No text extracted from ${file}`);
      }
    }
  });
};

// Define paths
const picFolderPath = "/home/sumit/Project/App/server/pic";
const outputTextPath = "/home/sumit/Project/App/server/util/extractedText.txt";

// Process all images in the pic folder
processImagesInDirectory(picFolderPath, outputTextPath);
