import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Screen } from "./Screen";
import { Admin } from "./Admin";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/play" component={Admin} />
        <Route path="/screen/:screenNumber?" component={Screen} />
        <Redirect to="/play" />
      </Switch>
    </Router>
  );
}

export default App;
