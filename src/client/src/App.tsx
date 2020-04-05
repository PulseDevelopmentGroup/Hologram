import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Screen } from "./Screen";
import { Admin } from "./Admin";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: window.location.origin + "/graphql",
  }),
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <Switch>
          <Route path="/play" component={Admin} />
          <Route path="/screen/:screenNumber?" component={Screen} />
          <Redirect to="/play" />
        </Switch>
      </ApolloProvider>
    </Router>
  );
}

export default App;
