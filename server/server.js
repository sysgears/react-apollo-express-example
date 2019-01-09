const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('./config/database');

const typeDefs = require('./modules/post/graphqlSchema');
const resolvers = require('./modules/post/resolvers');

// Create Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// Create Express app
const app = express();

// Use Express app as middleware in Apollo Server instance
server.applyMiddleware({ app });

// Listen server
app.listen({ port: 3000 }, () =>
  console.log(`🚀Server ready at http://localhost:3000${server.graphqlPath}`)
);
