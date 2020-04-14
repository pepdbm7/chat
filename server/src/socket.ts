import { Server, Socket } from "socket.io";

const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
} = require("../../client/src/socketEvents");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

export default (io: Server) => {
  io.on("connect", (socket: Socket) => {
    console.log("Socket.io server just connected!!!");
    socket.on("join", ({ username, room }, callback: Function) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) return callback(error);

      socket.join(user.room);

      socket.emit("message", {
        user: "admin",
        text: `${user.username}, welcome to room ${user.room}.`,
      });
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.username} has joined!`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit("message", { user: user.username, text: message });

      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      console.log(`${user.username} has left.`);

      if (user) {
        io.to(user.room).emit("message", {
          user: "Admin",
          text: `${user.username} has left.`,
        });
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};
