const Group = require("../models/GroupModel");
const Member = require("../models/MemberModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const generateUniqueId = async (prefix) => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const GroupShareId = prefix + randomDigits;

  while (!(await isGroupShareIdUnique(GroupShareId))) {
    GroupShareId = prefix + Math.floor(100000 + Math.random() * 900000);
    console.log("Retry with new TestId:", GroupShareId);
  }

  return GroupShareId;
};

const isGroupShareIdUnique = async (GroupShareId) => {
  const existingGroup = await Group.findOne({ GroupShareId });
  return !existingGroup;
};

const createGroup = async (req, res) => {
  try {
    const prefix = "MA";
    let GroupShareId = await generateUniqueId(prefix);

    const { name, description, creatorId, members } = req.body;

    // Check if at least one member is provided
    if (!members || members.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one member is required to create a group." });
    }

    // Create the group
    const group = await Group.create({
      name,
      description,
      creatorId,
      GroupShareId,
    });

    console.log("GroupShareId" + GroupShareId);

    // Add members to the group
    await Promise.all(
      members.map(async (member) => {
        // Create member and add it to the group
        //  console.log("Member" + JSON.stringify(member));
        const newMember = await Member.create({
          userId: member.id,
          groupId: group._id,
          name: member.name,
          username: member.username,
        });

        group.members.push(newMember);
      })
    );

    // Save the updated group with members
    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group." });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch groups." });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch group." });
  }
};

const joinGroupBySharedId = async (req, res) => {
  try {
    const { GroupShareId, userId, name, username } = req.body;

    if (!GroupShareId || !userId || !name || !username) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the group by GroupShareId
    const group = await Group.findOne({ GroupShareId });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Check if the user is already a member of the group
    const existingMember = await Member.findOne({
      groupId: group._id,
      userId,
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User is already a member of this group.",
      });
    }

    // Create and add the new member to the group
    const newMember = await Member.create({
      userId,
      groupId: group._id,
      name,
      username,
    });

    group.members.push(newMember);
    await group.save();

    res.status(201).json({
      status: "success",
      message: "User added to the group successfully",
      data: group,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, description },
      { new: true }
    );
    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update group." });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json({ message: "Group is Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete group." });
  }
};

// Get groups by user ID
// const getGroupsByUserId = async (req, res) => {
//   try {
//     const userId = req.params.userId; // Assuming userId is passed in the request params

//     console.log("user id in sever " + userId);
//     const user = await User.findById(userId);
//     console.log("user" + user._id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // const userIdObject = mongoose.Types.ObjectId(userId);

//     const groups = await Group.find({
//       members: user._id,
//     });

//     console.log("groups" + groups);

//     res.status(200).json(groups);
//   } catch (error) {
//     console.error("Error fetching groups:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const getGroupsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is in the URL params

    // const user = await User.find({ userId });
    // console.log("User" + user._id);
    const groups = await Group.find({ "members.userId": userId });
    if (!groups) {
      return res.status(404).json({ message: "No groups found for this user" });
    }

    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const myChats = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is in the URL params

    console.log(userId);

    const chats = await Group.find({
      _id: userId,
    })
      .populate({
        path: "users",
        select: "username email",
      })
      .sort({ updatedAt: -1 });
    res.send({
      data: chats,
      status: true,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

const chatById = async (req, res) => {
  const chatId = req.query.chatId;
  console.log("chatIdchatId", chatId);
  try {
    const chats = await Group.findById(chatId).populate({
      path: "users",
      select: "username email",
    });
    res.send({
      data: chats,
      status: true,
    });
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupsByUserId,
  myChats,
  chatById,
  joinGroupBySharedId,
};
