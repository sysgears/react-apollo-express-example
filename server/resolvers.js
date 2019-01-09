// Dummy data
const posts = [
  { title: 'Post Title1', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  { title: 'Post Title2', content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
  { title: 'Post Title3', content: 'Contrary to popular belief, Lorem Ipsum is not simply random text. ' }
];


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // Query which returns posts list
    posts: () => posts
  },
  Mutation: {
    /* Mutation which provides functionality for adding post to the posts list
    * and return post after successfully adding to list
    */
    addPost: (_, post) => {
      posts.push(post);
      return post
    }
  }
};

module.exports = resolvers;
