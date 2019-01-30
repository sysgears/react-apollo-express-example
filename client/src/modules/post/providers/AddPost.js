import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import { GET_POSTS } from './PostList';

const ADD_POST = gql`
  mutation($title: String!, $content: String!) {
    addPost(title: $title, content: $content) {
      title
      content
    }
  }
`;

const withAddPost = Component => props => {
  return (
    <Mutation mutation={ADD_POST}>
      {addPost => {
        return (
          <Component addPost={({ title, content }) => addPost({
            variables: { title, content }, refetchQueries: [
              { query: GET_POSTS }
            ] })}
          />
        )
      }}
    </Mutation>
  );
};

export default withAddPost;