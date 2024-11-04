// controllers/constantsController.js
const Constant = require("../models/Constant");

// Get all constants
// const getConstants = async (req, res) => {
//   try {
//     const constants = await Constant.find({});
//     const constantsObject = {};

//     // Convert the array of constants into an object
//     constants.forEach((constant) => {
//       constantsObject[constant.key] = constant.value;
//     });

//     return res.json({ success: true, data: constantsObject });
//   } catch (error) {
//     console.error("Error fetching constants:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch constants" });
//   }
// };

// const getConstants = async (req, res) => {
//   try {
//     const constants = await Constant.find({});
//     const constantsObject = {};

//     // Convert the array of constants into an object
//     constants.forEach((constant) => {
//       constantsObject[constant.key] = constant.value;
//     });

//     // Get the value for MEADHIKARI_SERVER_URL
//     const meadhikariServerKey = constantsObject.MEADHIKARI_SERVER_URL;

//     // If the MEADHIKARI_SERVER_URL key points to another key, get the corresponding value
//     if (meadhikariServerKey) {
//       constantsObject.MEADHIKARI_SERVER_URL =
//         constantsObject[meadhikariServerKey] || meadhikariServerKey; // Replace key with actual value
//     }

//     return res.json({ success: true, data: constantsObject });
//   } catch (error) {
//     console.error("Error fetching constants:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch constants" });
//   }
// };

const getConstants = async (req, res) => {
  try {
    const constants = await Constant.find({});
    const constantsObject = {};

    // Convert the array of constants into an object
    constants.forEach((constant) => {
      constantsObject[constant.key] = constant.value;
    });

    // Get the value for MEADHIKARI_SERVER_URL
    const meadhikariServerKey = constantsObject.MEADHIKARI_SERVER_URL;
    if (meadhikariServerKey) {
      constantsObject.MEADHIKARI_SERVER_URL =
        constantsObject[meadhikariServerKey] || meadhikariServerKey; // Replace key with actual value
    }

    // Get the value for MEADHIKARI_SOCKET_URL
    const meadhikariSocketKey = constantsObject.MEADHIKARI_SOCKET_URL;
    if (meadhikariSocketKey) {
      constantsObject.MEADHIKARI_SOCKET_URL =
        constantsObject[meadhikariSocketKey] || meadhikariSocketKey; // Replace key with actual value
    }

    return res.json({ success: true, data: constantsObject });
  } catch (error) {
    console.error("Error fetching constants:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch constants" });
  }
};

// Create a new constant
const createConstant = async (req, res) => {
  const { key, value } = req.body;

  try {
    const existingConstant = await Constant.findOne({ key });
    if (existingConstant) {
      return res
        .status(400)
        .json({ success: false, message: "Constant already exists" });
    }

    const newConstant = new Constant({ key, value });
    await newConstant.save();
    return res.status(201).json({ success: true, data: newConstant });
  } catch (error) {
    console.error("Error creating constant:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create constant" });
  }
};

// Update an existing constant
const updateConstant = async (req, res) => {
  const { key } = req.params; // Key of the constant to update
  const { value } = req.body;

  try {
    const updatedConstant = await Constant.findOneAndUpdate(
      { key },
      { value },
      { new: true } // Return the updated document
    );

    if (!updatedConstant) {
      return res
        .status(404)
        .json({ success: false, message: "Constant not found" });
    }

    return res.json({ success: true, data: updatedConstant });
  } catch (error) {
    console.error("Error updating constant:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update constant" });
  }
};

// Delete a constant
const deleteConstant = async (req, res) => {
  const { key } = req.params; // Key of the constant to delete

  try {
    const deletedConstant = await Constant.findOneAndDelete({ key });

    if (!deletedConstant) {
      return res
        .status(404)
        .json({ success: false, message: "Constant not found" });
    }

    return res.json({
      success: true,
      message: "Constant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting constant:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete constant" });
  }
};

module.exports = {
  getConstants,
  createConstant,
  updateConstant,
  deleteConstant,
};
