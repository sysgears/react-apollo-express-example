import React, { Component } from 'react';
import { Card, CardTitle, CardBody } from 'reactstrap';

export default class PostList extends Component {
  constructor(props) {
    super(props);

    this.showPosts = this.showPosts.bind(this);
  }

  showPosts() {
    const { posts, postsLoading } = this.props;

    if (!postsLoading && posts.length > 0) {
      return posts.map(post => {
        return (
          <Card key={post._id} body outline className="post-card">
            <CardTitle>{post.title}</CardTitle>
            <CardBody>{post.content}</CardBody>
          </Card>
        );
      });
    } else {
      return (
        <div>
          <h3>No posts available</h3>
          <p className="lead">Use the form on the right to create a new post.</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="posts-container">
        {this.showPosts()}
      </div>
    );
  }
}
