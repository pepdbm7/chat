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

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getTime,
} = require("./users");

interface IUser {
  username?: string;
  room?: string;
}

interface IMessage {
  id: string;
  time: string;
  text: string;
  emitter: string;
}

export default (io: Server) => {
  io.on("connect", (socket: Socket) => {
    console.log(`User with ID: ${socket.id} just connected!!!`);

    socket.on(JOIN_CHAT, ({ username, room }: IUser, callback: Function) => {
      const { error, user } = addUser({ id: socket.id, username, room });
      if (error) return callback(error);

      socket.join(user.room);
      console.log(username + " joined chat", room);

      socket.emit("message", {
        id: "asdf",
        emitter: "admin",
        text: `${user.username}, welcome to room ${user.room}.`,
        time: getTime(),
      });

      socket.to(user.room).emit("message", {
        id: "fdsasf",
        emitter: "admin",
        text: `${user.username} has joined!`,
        time: getTime(),
      });

      if (user) io.to(user.room).emit("roomData", getUsersInRoom(user.room));
    });

    socket.on("sendMessage", (message, callback) => {
      const { user, error } = getUser(socket.id);
      if (error) return callback(error);

      io.to(user.room).emit("message", {
        id: "1234",
        emitter: user.username,
        text: message,
        time: getTime(),
      });
    });

    socket.on("disconnect", () => {
      const { user } = removeUser(socket.id);
      const usersInChat = getUsersInRoom(user.room).users.length;

      //if users in chat, let them know this user left:
      if (user && usersInChat) {
        io.to(user.room).emit("message", {
          id: "sdf22a",
          emmiter: "admin",
          text: `${user.username} has left from room ${user.room}.`,
          time: getTime(),
        });

        io.to(user.room).emit("roomData", usersInChat);
      }
    });
  });
};
