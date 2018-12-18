import React, { Component } from 'react'
import { Card, Button, CardTitle, CardText } from 'reactstrap';

import { withPosts } from '../providers';

import '../styles/styles.css';


class Posts extends Component {
  render() {
    const { posts, postsLoading } = this.props;
    return (
      <div className="posts-container">
        <h2 className="posts-title">Posts</h2>
        {
          !postsLoading && posts ? posts.map((post, index) => {
            return (
              <Card key={index} body className="text-center">
                <CardTitle>{post.title}</CardTitle>
                <CardText>{post.content}</CardText>
              </Card>
            );
          }) : <div>Loading...</div>
        }
      </div>
    )
  }
}

/* Wrap Posts component using withPosts provider
* for getting posts list in the Posts component
*/
export default withPosts(Posts);