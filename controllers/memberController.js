const Member = require("../models/MemberModel");
const User = require("../models/userModel");
const Group = require("../models/GroupModel");

exports.addMember = async (req, res) => {
  try {
    const { groupId, members } = req.body;

    if (!groupId || !members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one member is required" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Check and add each member to the group
    await Promise.all(
      members.map(async (member) => {
        const existingMember = await Member.findOne({
          groupId,
          userId: member.id,
        });

        if (existingMember) {
          return res.status(400).json({
            message: "Member already exists in the group.",
          });
        } else {
          // Create and add the new member to the group
          const newMember = await Member.create({
            userId: member.id,
            groupId,
            name: member.name,
            username: member.username,
          });

          group.members.push(newMember);

          await group.save();

          // Fetch the updated group data
          const updatedGroup = await Group.findById(groupId);

          res.status(201).json({
            status: "success",
            message: "Members added successfully",
            data: updatedGroup,
          });
        }
      })
    );
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a member's role in a group
exports.updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }

    member.role = role;
    await member.save();
    res.status(200).json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    // Find the group in the Group collection
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Remove the member from the members array in the group
    const updatedMembers = group.members.filter(
      (member) => member.userId.toString() !== memberId
    );
    group.members = updatedMembers;
    await group.save();

    // Remove the member entry from the Member collection
    // await Member.findByIdAndDelete(memberId);
    const deletedMember = await Member.findOneAndDelete({
      groupId,
      userId: memberId,
    });

    if (!deletedMember) {
      return res.status(404).json({ error: "Member not found." });
    }

    const UpdatedGroup = await Group.findById(groupId);

    res.status(200).json({
      status: "Succuess",
      data: UpdatedGroup,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.leftGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    // Find the group in the Group collection
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Remove the member from the members array in the group
    const updatedMembers = group.members.filter(
      (member) => member.userId.toString() !== memberId
    );
    group.members = updatedMembers;
    await group.save();

    // Remove the member entry from the Member collection
    // await Member.findByIdAndDelete(memberId);
    const deletedMember = await Member.findOneAndDelete({
      groupId,
      userId: memberId,
    });

    if (!deletedMember) {
      return res.status(404).json({ error: "Member not found." });
    }

    const UpdatedGroup = await Group.findById(groupId);

    res.status(200).json({
      status: "Succuess",
      data: UpdatedGroup,
      message: "You Left this Group Successfully.",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      // $or: [
      //   { username: { $regex: query, $options: "i" } }, // Case-insensitive search by name
      // ],
      username: query,
    }).select("name email username"); // Only select name and email fields

    if (users.length === 0) {
      res.status(500).json({
        status: "false",
        message: "User not found with this username",
      });
    } else {
      res.json(users);
    }
    console.log(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
