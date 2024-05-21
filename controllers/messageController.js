const Message = require("../models/MessageModel");
const CustomTest = require("../models/CustomTestModel");
const Group = require("../models/GroupModel");
const { match } = require("assert");

// Create a new message
exports.createMessage = async (req, res) => {
  const { groupId, senderId, content, customTestId } = req.body;

  try {
    // Check if the CustomTest exists and meets the conditions
    const customTest = await CustomTest.findById(customTestId);
    if (
      !customTest ||
      customTest.totalQuestions <= 0 ||
      customTest.passingMarks <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalid CustomTest or conditions not met." });
    }

    const newMessage = new Message({
      groupId,
      senderId,
      content,
      customTestId,
    });

    await newMessage.save();
    res
      .status(201)
      .json({ message: "Message created successfully.", newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

// Get messages by groupId
exports.getMessagesByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).populate(
      "senderId",
      "username"
    ); // Assuming senderId is a reference to the User model
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

// Update a message by messageId
exports.updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({
      message: "Message updated successfully.",
      updatedMessage: message,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

// Delete a message by messageId
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, text, receiverId, type, userId, buttonTitle } = req.body;
  console.log("buttonTitle" + JSON.stringify(buttonTitle));

  try {
    const newMessage = await Message.create({
      text,
      chatId,
      user: userId,
      button: { title: buttonTitle }, // Include button title in the message creation
    });
    const chatUpdate = await Group.findByIdAndUpdate(
      chatId,
      {
        latestMessage: text,
        lastMessageAt: new Date(), // Set lastMessageAt to current date/time
      },
      {
        new: true,
      }
    );

    console.log("chatUpdate" + JSON.stringify(chatUpdate));
    // console.log("newMessage" + JSON.stringify(newMessage));

    res.send({
      data: newMessage,
      roomData: chatUpdate,
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: false, error: error });
  }
};

// exports.sendMessage = async (req, res) => {
//   const { chatId, text, receiverId, type, userId, testId } = req.body;
//   try {
//     const customTest = await CustomTest.findOne({ testId });

//     if (!customTest) {
//       return res.status(404).json({ status: false, message: "Test not found" });
//     }

//     const { testName, totalQuestions } = customTest;

//     // console.log("==========testName===========" + testName);
//     // console.log("==========totalQuestions===========" + totalQuestions);
//     // console.log("==========customTest===========" + JSON.stringify(customTest));

//     const newMessage = await Message.create({
//       text,
//       chatId,
//       user: userId,
//     });
//     const chatUpdate = await Group.findByIdAndUpdate(
//       chatId,
//       {
//         latestMessage: text,
//       },
//       {
//         new: true,
//       }
//     );

//     console.log("chatUpdate" + JSON.stringify(chatUpdate));

//     res.send({
//       data: {
//         newMessage,
//         customTestData: {
//           customTest,
//         },
//       },
//       roomData: chatUpdate,
//       status: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(403).json({ status: false, error: error });
//   }
// };

exports.myMessages = async (req, res) => {
  const chatId = req.query.chatId;
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;
  // const skip = (page - 1) * limit;
  try {
    const messages = await Message.find({
      chatId: chatId,
    })
      .populate({
        path: "user",
        select: "username",
      })
      .sort({ createdAt: -1 });
    // .skip(skip)
    // .limit(limit);
    res.send({
      data: messages,
      status: true,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};
