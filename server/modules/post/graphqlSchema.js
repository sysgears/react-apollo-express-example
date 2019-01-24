const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Post {
    _id: String,
    title: String,
    content: String,
  },
  type Query {
    posts: [Post]
  },
  type Mutation {
    addPost(title: String!, content: String!): Post,
  }
`;

module.exports = typeDefs;
