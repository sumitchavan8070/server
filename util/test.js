// const pdfParse = require("pdf-parse");
// const fs = require("fs"); // File system module for file saving

// const pdfFilePath = "/home/sumit/Project/App/server/util/abc.pdf"; // Update with your PDF file path

// const outputFilePath = "/home/sumit/Project/App/server/util/extracted_text.txt"; // Replace with desired output filename

// pdfParse(pdfFilePath)
//   .then((data) => {
//     const extractedText = data.text;
//     fs.writeFile(outputFilePath, extractedText, (err) => {
//       if (err) {
//         console.error("Error saving text to file:", err);
//       } else {
//         console.log(
//           "Text extracted and saved successfully to:",
//           outputFilePath
//         );
//       }
//     });
//   })
//   .catch((err) => {
//     console.error("Error parsing PDF:", err);
//   });

const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;

const pdfPath = "/home/sumit/Project/App/server/util/abc.pdf"; // Update with your PDF file path

const loadPdf = async () => {
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  let text = "";

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const content = await page.getTextContent();
    for (const textItem of content.items) {
      text += textItem.str + " ";
    }
  }

  console.log(text);
};

loadPdf();
