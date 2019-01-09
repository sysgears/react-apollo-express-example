import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from "apollo-boost";
import { GET_POSTS } from "../providers/PostsList";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const ADD_POST = gql`
  mutation($title: String!, $content: String!) {
    addPost(title: $title, content: $content) {
      title
      content
    }
  }
`;

export default class PostForm extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(event, addPost) {
    event.preventDefault();

    addPost({
      variables: {
        title: event.target.title.value,
        content: event.target.content.value,
      },
      refetchQueries: [
        { query: GET_POSTS }
      ]
    });
  }

  render() {
    return (
      <Mutation mutation={ADD_POST}>
        {(addPost) => {
          return (
            <div className="post-form">
              <h2>Create new post</h2>
              <Form onSubmit={(event) => this.submitForm(event, addPost)}>
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
        }}
      </Mutation>
    )
  }
}
