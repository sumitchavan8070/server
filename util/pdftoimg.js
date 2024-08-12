const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");

// Path to your PDF file
const pdfPath =
  "/home/sumit/Project/App/server/QuestionPaperPdf/Combine new 2023.pdf";

// Output directory for images
const outputDir = "/home/sumit/Project/App/server/pic/";

// Create pdf2pic instance with options
// const converter = fromPath(pdfPath, {
//   density: 150, // DPI (optional, default is 150)
//   saveIn: outputDir, // Output directory for images
//   saveAs: {
//     // Output format and file name pattern
//     type: "jpg", // Image format ('jpg', 'png', or 'webp')
//     prefix: "image_", // Prefix for output image files
//     suffix: "", // Suffix for output image files
//   },
// });
const converter = fromPath(pdfPath, {
  density: 300, // DPI for high-quality images
  saveFilename: "image_", // Base name for output files
  savePath: outputDir, // Output directory for images
  format: "jpg", // Image format ('jpg', 'png', or 'webp')
  width: 2480, // Width for A4 size at 300 DPI
  height: 3508, // Height for A4 size at 300 DPI
  suffix: "", // Suffix for output image files
});

// Convert PDF to images
// converter
//   .bulk(-1) // Convert all pages. You can specify a single page number here.
//   .then((results) => {
//     // Move the images to the specified output directory
//     results.forEach((result) => {
//       const oldPath = result.path;
//       const newPath = path.join(outputDir, result.name);

//       // console.log("Old path " + oldPath);
//       // console.log("New path " + newPath);

//       fs.move(oldPath, newPath)
//         .then(() => console.log("Image moved:", newPath))
//         .catch((error) => console.error("Error moving image:", error));
//     });
//     console.log("Images converted successfully:", results);
//   })
//   .catch((error) => {
//     console.error("Error converting PDF to images:", error);
//   });
converter
  .bulk(-1) // Convert all pages. You can specify a single page number here.
  .then((results) => {
    results.forEach((result, index) => {
      const oldPath = result.path;
      const newPath = path.join(outputDir, `image_${index + 1}.jpg`);
      fs.move(oldPath, newPath)
        .then(() => console.log("Image moved:", newPath))
        .catch((error) => console.error("Error moving image:", error));
    });
    console.log("Images converted successfully:", results);
  })
  .catch((error) => {
    console.error("Error converting PDF to images:", error);
  });
