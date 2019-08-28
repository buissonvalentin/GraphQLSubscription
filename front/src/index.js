import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import App from "./App";

let client;

const connectApollo = () => {
  connectSocket();
};

const connectYoga = () => {
  connectSocket(false);
};

const connectSocket = (isApolloServer = true) => {
  const uriApollo = "://localhost:4000/graphql";
  const uriYoga = "://localhost:4000";

  const uri = isApolloServer ? uriApollo : uriYoga;

  const httpLink = new HttpLink({
    uri: `http${uri}`
  });

  const wsLink = new WebSocketLink({
    uri: `ws${uri}`,
    options: {
      reconnect: true
    }
  });

  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  client = new ApolloClient({
    link: terminatingLink,
    cache: new InMemoryCache()
  });
};

//connectApollo();
connectYoga();

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
