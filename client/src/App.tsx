import React, { SFC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import ChatsList from "./components/ChatsList/ChatsList";
import "./App.scss";

interface IAppProps {}

const App: SFC<IAppProps> = () => {
  //all logic here
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props: any) => {
            console.log(props);
            return <Landing {...props} />;
          }}
        />
        <Route
          exact
          path="/chatslist"
          render={(props: any) => <ChatsList {...props} chats={[]} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
