import React, { Component } from 'react'
import PostList from './PostList';
import PostForm from './PostForm';

import { withPosts } from '../providers';
import { Container, Row, Col } from 'reactstrap';
import '../styles/styles.css';

class PostsRoot extends Component {
  render() {
    const { posts, postsLoading } = this.props;

    return (
      <Container>
        <h2 className="posts-title">Posts Component</h2>
        <Row>
          <Col>
            <PostList postsLoading={postsLoading} posts={posts} />
          </Col>
          <Col>
            <PostForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

/**
 * Wrap Posts component using withPosts provider
 * for getting posts list in the Posts component
 */
export default withPosts(PostsRoot);
