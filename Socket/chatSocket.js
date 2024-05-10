const UserModel = require("../models/userModel");
const socktIdToUserId = new Map();

const { firebase } = require("../firebase/index");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} join room ${chatId}`);
    });

    socket.on("leave_room", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} leave room ${chatId}`);
    });

    socket.on("join_chat", (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} join chat ${userId}`);
    });

    socket.on("leave_chat", (userId) => {
      socket.leave(userId);
      console.log(`User ${socket.id} leave chat ${userId}`);
    });

    socket.on("is_typing", ({ roomId, userId }) => {
      io.to(roomId).emit("user_typing", { userId });
    });
    socket.on("stop_typing", ({ roomId, userId }) => {
      io.to(roomId).emit("user_stopped", { userId });
    });

    socket.on("send_message", (data) => {
      // console.log("send_message", data.user._id);
      // console.log("send_message==============>", data);

      io.to(data.chatId).emit("send_message", data);
      io.to(data.user._id).emit("new_chat", data.roomData);
      sendNotification(data);
    });

    socket.on("user_online", async ({ userId }) => {
      try {
        const user = await UserModel.findById(userId);
        if (user) {
          user.online = true;
          await user.save();
          socktIdToUserId.set(socket.id, userId);
          io.emit("user_online", { userId: user._id, online: true });
          console.log(userId, "+++user online success++++");
        }
      } catch (error) {
        console.log("error updating user status:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected");
      const userId = socktIdToUserId.get(socket.id);
      if (userId) {
        try {
          const user = await UserModel.findById(userId);
          if (user) {
            (user.online = false), (user.lastSeen = new Date());
            await user.save();
            io.emit("user_online", {
              userId: user._id,
              online: false,
              lastSeen: user.lastSeen,
            });
            console.log("user disconnected succesfully...!");
          }
        } catch (error) {}
      }
    });
  });
};

const sendNotification = async (notificationData) => {
  console.log("notification data received", notificationData);

  try {
    const members = notificationData.roomData.members;
    console.log("Members:", members);

    // Construct an array of member IDs excluding the sender's ID
    const receiverIds = members
      .map((member) =>
        member.userId !== notificationData.user._id ? member.userId : null
      )
      .filter(Boolean);
    console.log("Receiver IDs:", receiverIds);

    if (receiverIds.length > 0) {
      for (const userId of receiverIds) {
        let user = await UserModel.findById(userId);

        if (!!user?.fcmToken) {
          let notificationPayload = {
            roomId: notificationData.chatId,
            roomName: notificationData.roomData.name,
            receiverIds: userId,
            // Add other properties to the payload as needed
          };

          console.log("notification payload ===> ", notificationPayload);

          // Send the notification to each member individually
          let res = await firebase.messaging().send({
            token: user.fcmToken,
            notification: {
              title: "New Message",
              body: notificationData.text,
            },
            data: {
              notification_type: "chat",
              navigationId: "messages",
              data: JSON.stringify(notificationPayload),
            },
          });
          console.log("Notification sent successfully to", user.username, res);
        }
      }
    }
  } catch (error) {
    console.log("Notification failed", error);
  }
};

// const sendNotification = async (notificationData) => {
//   console.log("notification data received", notificationData);

//   try {
//     // Fetch all members of the group based on chatId (groupId)
//     let groupMembers = await UserModel.find({
//       _id: { $in: notificationData.roomData.members },
//     });
//     console.log("groupMembers", groupMembers);

//     // Loop through each member and send a notification
//     for (let member of groupMembers) {
//       if (!!member?.fcmToken) {
//         let notificationPayload = {
//           roomId: notificationData.chatId,
//           roomName: member.username,
//         };

//         let res = await firebase.messaging().send({
//           token: member?.fcmToken,
//           notification: {
//             title: "New Message",
//             body: notificationData.text,
//           },
//           data: {
//             notification_type: "chat",
//             navigationId: "messages",
//             data: JSON.stringify(notificationPayload),
//           },
//         });
//         console.log(
//           "Notification sent successfully to",
//           member.username,
//           "Response:",
//           res
//         );
//       }
//     }
//   } catch (error) {
//     console.log("Notification failed", error);
//   }
// };

// const sendNotification = async (notificationData) => {
//   console.log("notification data received", notificationData);

//   try {
//     // Get the ID of the sender
//     const senderId = notificationData.user._id;

//     // Iterate through the group members to send notifications
//     notificationData.roomData.members.forEach(async (member) => {
//       // Skip sending notification to the sender
//       if (member._id !== senderId) {
//         if (!!member?.fcmToken) {
//           let notificationPayload = {
//             roomId: notificationData.chatId,
//             roomName: member.username, // Use member's username for roomName
//           };

//           let res = await firebase.messaging().send({
//             token: member?.fcmToken,
//             notification: {
//               title: "New Message",
//               body: notificationData.text,
//             },
//             data: {
//               notification_type: "chat",
//               navigationId: "messages",
//               data: JSON.stringify(notificationPayload),
//             },
//           });
//           console.log("notification sent successfully to", member.username, res);
//         }
//       }
//     });
//   } catch (error) {
//     console.log("notification failed", error);
//   }
// };
