import router from "./routes";
// node core:
import http from "http";
// dependencies:
import express, { Application } from "express";
import socketIO from "socket.io";
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app: Application = express();

const server = http.createServer(app);

const io = socketIO(server);

server.listen(PORT, () =>
  console.log(`Server running in port ${PORT}---------`)
);

app.use(router);

io.on("connect", (socket) => {
  console.log("Socket.io server just connected!!!");

  //when a user(socket) disconnects:
  socket.on("disconnect", () => console.log("a user has left!"));
});
