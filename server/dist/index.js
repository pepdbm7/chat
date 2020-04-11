"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = __importDefault(require("./routes"));
// node core:
var http_1 = __importDefault(require("http"));
// dependencies:
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
require("dotenv").config();
var PORT = process.env.PORT || 8080;
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = socket_io_1.default(server);
server.listen(PORT, function () {
    return console.log("Server running in port " + PORT + "---------");
});
app.use(routes_1.default);
io.on("connect", function (socket) {
    console.log("Socket.io server just connected!!!");
    //when a user(socket) disconnects:
    socket.on("disconnect", function () { return console.log("a user has left!"); });
});
