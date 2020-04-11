import React, { SFC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./components/Landing";
import ChatsList from "./components/ChatsList";
import "./App.css";

interface IAppProps {}

const App: SFC<IAppProps> = () => {
  //all logic here
  const onSubmit = () => {};
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <Landing {...props} onSubmit={onSubmit} />}
        />
        <Route
          exact
          path="/chatslist"
          render={(props) => <ChatsList {...props} chats={[]} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
