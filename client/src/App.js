import React, { Component } from 'react'

import { ApolloProvider } from 'react-apollo';

import apolloClient from './config/createApolloClient';

import { Posts } from './modules';

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
