import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Screen } from "./Screen";

function App() {
  return (
    <Router>
      <Route path="/screen/:screenNumber?" component={Screen} />
    </Router>
  );
}

export default App;
