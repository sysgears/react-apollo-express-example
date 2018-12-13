const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphqlSchema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 8080 }, () =>
  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
);