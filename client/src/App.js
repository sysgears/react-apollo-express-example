import React, { Component } from 'react'

import { ApolloProvider } from 'react-apollo';
import gql from "graphql-tag";

import apolloClient from './createApolloClient';

apolloClient
  .query({
    query: gql`
      {
        posts {
          title
          authorName
        }
      }
    `
  })
  .then(result => console.log(result));

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <div>
          Hello react
        </div>
      </ApolloProvider>
    )
  }
}
