const Post = require('./models/post');

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // Query which returns posts list
    posts: () => Post.find({})
  },
  Mutation: {
    /* Mutation which provides functionality for adding post to the posts list
    * and return post after successfully adding to list
    */
    addPost: (_, post) => {
      const newPost = new Post({ title: post.title, content: post.content });
      return newPost.save();
    }
  }
};

module.exports = resolvers;