import React, { SFC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./components/Landing";
import ChatsList from "./components/ChatsList";
import "./App.css";

interface IAppProps {}

const App: SFC<IAppProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/chatslist" component={ChatsList} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
