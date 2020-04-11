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
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";

const httpLink = new HttpLink({
  uri: window.location.origin + "/graphql",
});

// For now, gotta manually point this at the api url since otherwise, it conflicts with the webpack dev server hmr websocket
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
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
