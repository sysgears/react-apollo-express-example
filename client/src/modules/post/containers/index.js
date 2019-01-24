import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';

import { withPosts } from '../providers';
import { PostsList, PostForm } from '../components';

import '../styles/styles.css';

/**
 * Wrap Posts component using withPosts provider
 * for getting posts list in the Posts component
 */
@withPosts
export default class PostsRoot extends Component {
  render() {
    const { posts, postsLoading } = this.props;

    return (
      <Container>
        <h2 className="posts-title">Posts Module</h2>
        <hr />
        <Row>
          <Col>
            <PostsList postsLoading={postsLoading} posts={posts} />
          </Col>
          <Col>
            <PostForm />
          </Col>
        </Row>
      </Container>
    )
  }
}
