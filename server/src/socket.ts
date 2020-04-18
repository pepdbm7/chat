import { Server, Socket } from "socket.io";

const {
  VERIFY_USER,
  JOIN_CHAT,
  SEND_MESSAGE,
  TYPING,
  LOGOUT,
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

    socket.on(VERIFY_USER, ({ username, room }: IUser, callback: Function) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) return callback({ error });
      return callback({ user });
    });

    socket.on(JOIN_CHAT, ({ username, room }) => {
      socket.join(room);

      socket.emit("message", {
        id: String(Math.random()),
        emitter: "admin",
        text: `${username}, welcome to room ${room.toUpperCase()}`,
        time: getTime(),
      });

      socket.to(room).emit("message", {
        id: String(Math.random()),
        emitter: "admin",
        text: `${username} has joined!`,
        time: getTime(),
      });

      io.to(room).emit("roomData", getUsersInRoom(room));
    });

    socket.on(SEND_MESSAGE, (message: string, callback: Function) => {
      const { user, error } = getUser(socket.id);
      if (error) return callback(error);

      io.to(user.room).emit("message", {
        id: String(Math.random()),
        emitter: user.username,
        text: message,
        time: getTime(),
      });
    });

    const disconnect = () => {
      const { removedUser } = removeUser(socket.id);
      const usersInChat =
        removedUser && getUsersInRoom(removedUser.room).users.length;
      console.log("disconnecting,", { removedUser }, { usersInChat });

      //if users in chat, let them know this user left:
      if (removedUser && usersInChat) {
        console.log("disconnecting y users:", { removedUser }, { usersInChat });
        io.to(removedUser.room).emit("message", {
          id: String(Math.random()),
          emitter: "admin",
          text: `${
            removedUser.username
          } has left from room ${removedUser.room.toUpperCase()}`,
          time: getTime(),
        });

        io.to(removedUser.room).emit("roomData", usersInChat);
      }
    };

    socket.on(LOGOUT, () => {
      disconnect();
    });

    socket.on("disconnect", () => {
      disconnect();
    });
  });
};
