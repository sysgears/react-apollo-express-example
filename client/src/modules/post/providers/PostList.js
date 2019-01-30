import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

export const GET_POSTS = gql`
  {
    posts {
      _id
      title
      content
    }
  }
`;

const withPosts = Component => props => {
  return (
    <Query query={GET_POSTS}>
      {({ loading, data }) => {
        return (
          <Component postsLoading={loading} posts={data && data.posts} {...props} />
        );
      }}
    </Query>
  );
};

export default withPosts;
