import { Server, Socket } from "socket.io";

const {
  JOIN_CHAT,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
} = require("../../client/src/socketEvents");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

interface IUser {
  username?: string;
  room?: string;
}

export default (io: Server) => {
  io.on("connect", (socket: Socket) => {
    console.log(`Server: Socket with ID: ${socket.id} just connected!!!`);

    socket.on(JOIN_CHAT, ({ username, room }: IUser, callback: Function) => {
      const { error, user } = addUser({ id: socket.id, username, room });
      console.log("joining chat", error, user);
      if (error) return callback(error);

      socket.join(user.room);

      socket.emit("message", {
        user: "admin",
        text: `${user.username}, welcome to room ${user.room}.`,
      });
      //   socket.broadcast.to(user.room).emit("message", {
      //     user: "admin",
      //     text: `${user.username} has joined!`,
      //   });

      io.to(user.room).emit("roomData", () => {
        const { users, error } = getUsersInRoom(user.room);

        return {
          // room: user.room,
          users,
          error,
        };
      });
      callback();
    });

    socket.on("message", (message, callback) => {
      const { user, error } = getUser(socket.id);
      if (error) return callback(error);

      io.to(user.room).emit("message", { user: user.username, text: message });
      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        console.log(`${user.username} has left from ${user.room}.`);
        io.to(user.room).emit("message", {
          user: "Admin",
          text: `${user.username} has left from ${user.room}.`,
        });
        io.to(user.room).emit("roomData", () => {
          const { users, error } = getUsersInRoom(user.room);

          return {
            // room: user.room,
            users,
            error,
          };
        });
      }
    });
  });
};
