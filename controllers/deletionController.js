const DeletionRequest = require("../models/deletionRequest"); // Import the model
const path = require("path");

exports.getRequestDeletionPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../policy/requestDeletion.html"));
};

exports.handleDeletionRequest = async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new deletion request
    const deletionRequest = new DeletionRequest({
      email,
      phone,
    });

    // Save the deletion request to the database
    await deletionRequest.save();

    // Respond with success
    res.status(200).json({
      message:
        "Your request has been received. We will review and remove your account soon.",
    });
  } catch (error) {
    console.error("Error handling deletion request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
