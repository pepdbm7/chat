import React, { SFC, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import io from "socket.io-client";

//actions:
import { USER_CONNECTED } from "./socketEvents";

//components:
import Landing from "./components/Landing/Landing";
import Chat from "./components/Chat/Chat";
import Notfound from "./components/Notfound/Notfound";
//styles:
import "./App.scss";

const socketUrl = "http://localhost:5000";

interface IAppProps {}

interface IUser {
  username: string;
  room: string;
}

const App: SFC<IAppProps> = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    let socket = io(socketUrl);
    socket?.on("connect", () => {
      console.log("connected! front-end");
    });
    setSocket(socket);

    return () => {
      setSocket(null);
      // setUser(null);
    };
  }, []);

  const connectUserToSocket = (user: IUser) => {
    socket?.emit(USER_CONNECTED, user);
    setUser(user);
    console.log({ user });
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props: any) => (
            <Landing {...props} socket={socket} setUser={connectUserToSocket} />
          )}
        />
        <Route
          path="/chat"
          render={(props: any) =>
            socket ? (
              <Chat {...props} socket={socket} user={user} />
            ) : (
              <Redirect exact to={"/"} />
            )
          }
        />
        <Route path="/" component={Notfound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
