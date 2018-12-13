const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Post {
    title: String,
    authorName: String
  },
  type Query {
    posts: [Post]
  },
  type Mutation {
    addPost(title: String!, authorName: String!): Post,
  }
`;

module.exports = typeDefs;