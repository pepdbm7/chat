import React, { SFC, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import io from "socket.io-client";

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

  const createNewSocket = () => {
    let socket = io(socketUrl);
    socket?.on("connect", () => {
      console.log("connected! front-end");
    });
    setSocket(socket);
  };

  useEffect(() => console.log({ socket }, { user }), [socket, user]);

  const connectUserToSocket = (user: IUser) => {
    socket?.emit("connect", user);
    setUser(user);
    console.log({ user });
  };

  //to adapt height on mac device's browser:
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props: any) => (
            <Landing
              {...props}
              socket={socket}
              createNewSocket={createNewSocket}
              setUser={connectUserToSocket}
            />
          )}
        />
        <Route
          path="/chat"
          render={(props: any) =>
            socket ? (
              <Chat
                {...props}
                socket={socket}
                user={user}
                setSocket={setSocket}
                setUser={setUser}
              />
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
