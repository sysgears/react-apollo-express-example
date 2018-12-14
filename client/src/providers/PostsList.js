import React from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_POST = gql`
  {
    posts {
      title
      authorName
    }
  }
`;

const withPosts = Component => props => {
  return (
    <Query query={GET_POST}>
      {({ loading, data }) => {
        return (
          <Component postsLoading={loading} posts={data && data.posts} {...props} />
        );
      }}
    </Query>
  )
  
};

export default withPosts;