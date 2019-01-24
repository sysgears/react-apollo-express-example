import React, { Component } from 'react';

import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { withAddPost } from '../providers';

@withAddPost
export default class PostForm extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(event) {
    event.preventDefault();

    this.props.addPost({
      title: event.target.title.value,
      content: event.target.content.value
    });
  }

  render() {
    return (
      <div className="post-form">
        <h2>Create new post</h2>
        <Form onSubmit={(event) => this.submitForm(event)}>
          <FormGroup>
            <Label for="postTitle">Post Title</Label>
            <Input type="text" name="title" id="postTitle" placeholder="Add a title" />
          </FormGroup>
          <FormGroup>
            <Label for="postContent">Post Content</Label>
            <Input type="textarea" name="content" id="postContent" placeholder="Describe your post" />
          </FormGroup>
          <Button className="submit-button">Submit new post</Button>
        </Form>
      </div>
    )
  }
}
