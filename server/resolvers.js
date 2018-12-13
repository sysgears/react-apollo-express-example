const posts = [
  { title: 'Post Title1', authorName: 'Tom' },
  { title: 'Post Title2', authorName: 'Joe' },
  { title: 'Post Title3', authorName: 'Sam' },
  { title: 'Post Title4', authorName: 'John' },
];

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    posts: () => posts,
  },
  Mutation: {
    addPost: (_, post) => {
      posts.push(post);
      return post;
    }
  }
};

module.exports = resolvers;