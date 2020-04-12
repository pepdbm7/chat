import React, { SFC, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

//actions:
import { USER_CONNECTED, LOGOUT } from "./actions";

//components:
import Landing from "./components/Landing/Landing";
import Chat from "./components/Chat/Chat";
//styles:
import "./App.scss";

const socketUrl = "http://localhost:3000";

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
    // setSocket(socket);
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
      </Switch>
    </BrowserRouter>
  );
};

export default App;
