import React, { Component } from 'react'

import { ApolloProvider } from 'react-apollo';

import apolloClient from '../settings/createApolloClient';

import Posts from './Posts';


class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Posts />
      </ApolloProvider>
    )
  }
}

export default App;
