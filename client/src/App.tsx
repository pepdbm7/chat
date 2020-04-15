import React, { SFC, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

//actions:
import { USER_CONNECTED, LOGOUT } from "./socketEvents";

//components:
import Landing from "./components/Landing/Landing";
import Chat from "./components/Chat/Chat";
import Notfound from "./components/Notfound/Notfound";
//styles:
import "./App.scss";

const socketUrl = "http://localhost:5000";

interface IAppProps {}

interface IUser {}

const App: SFC<IAppProps> = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    let socket = io(socketUrl);
    socket?.on("connect", () => {
      console.log("connected! front-end");
    });
    setSocket(socket);
  }, []);

  const setUserFunction = (user: IUser) => {
    socket?.emit(USER_CONNECTED, user);
    setUser(user);
  };

  const logout = () => {
    socket?.emit(LOGOUT);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props: any) => (
            <Landing {...props} socket={socket} setUser={setUserFunction} />
          )}
        />
        <Route
          path="/chat"
          render={(props: any) => (
            <Chat {...props} socket={socket} user={user} logout={logout} />
          )}
        />
        <Route path="/" component={Notfound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
