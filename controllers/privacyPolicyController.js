const path = require("path");

exports.getPrivacyPolicy = (req, res) => {
  // Send the HTML file as a response
  res.sendFile(path.join(__dirname, "../policy/privacyPolicy.html"));
};
