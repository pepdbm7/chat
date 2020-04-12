import router from "./routes";
// node core:
import http from "http";
// dependencies:
import express, { Application } from "express";
import socketIO from "socket.io";
require("dotenv").config();

const app: Application = express();

const server = http.createServer(app);

const io = socketIO(server);

const PORT: string = process.env.PORT || "8080";

server.listen(PORT, () =>
  console.log(`Server running in port ${PORT}---------`)
);

app.use(router);

io.on("connect", (socket: socketIO.Socket) => {
  console.log("Socket.io server just connected!!!");

  //when a user(socket) disconnects:
  socket.on("disconnect", () => console.log("a user has left!"));
});
