const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  title: String,
  content: String
});

const Post = model('post', postSchema);

module.exports = Post;
