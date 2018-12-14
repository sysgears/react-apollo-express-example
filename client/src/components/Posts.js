import React, { Component } from 'react'

import { withPosts } from '../providers';


class Posts extends Component {
  render() {
    return (
      <div>
        Posts
      </div>
    )
  }
}

export default withPosts(Posts);
