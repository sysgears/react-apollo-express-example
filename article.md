# How to Create an Apollo, React, and Express application
Apollo is a great set of libraries that simplify our work with GraphQL in JavaScript-based applications. But how does Apollo actually work? The official Apollo documentation gives quite a few real-life code examples, but they’re all put out of context. To make clearer how Apollo works, we explain how to build a JavaScript application with an Express server and a React client that use Apollo to communicate. We also take our time to compare Apollo to GraphQL to make sure that we’re in the same boat when building the application.
Once you complete the tutorial and understand how all the key technologies work together, it may be worth trying out Create Apollo App, a simple command-line tool that helps to generate a fully configured Express, React, and Apollo project with just one command.
## An overview of Apollo, React, and Express application
Before we dive deep into the implementation details, we want to give a bird view on what our React and Express application powered by Apollo will look like.
We’re going to build a simple application that displays posts on the client and uses GraphQL to fetch the posts from the server as well as send new posts to the server to save them in the database. To implement this solution, we’ll:
* Build an Express server application that uses Apollo Server
* Connect the server to MongoDB using Mongoose
* Build a React client application that uses Apollo Client
Additionally, we also use React Bootstrap 4 components to use generic components such as Button, Form, and others with added styles.
Throughout the project, we use Yarn to install and handle the dependencies, but you can use the standard package manager as well. We also recommend using the latest stable version of Node.js, but any version starting from Node.js 6^ will make it.
We assume that you already have a basic understanding of React, Express, MongoDB, and GraphQL. And even if you’re not familiar with all the mentioned technologies, we still give a detailed explanation of each code snippet to help your understand how and why everything works.
## Express, React, Apollo application structure
The application that you’re going to create is typical of many JavaScript-based project. Here’s what it look like:
```
graphql-app
├── client                              # The frontend package
│   └── src                             # All the source files of the React app
│     ├── modules                       #
│     │   ├── post                      # The Posts module
│     │   └── index.js                  # Entry point for the Post module
│     ├── settings
│     ├── App.js
│     ├── index.html
│     └── index.js
├── node_modules                        # Global Node.js modules
└── server                                          # Server package
    ├── graphqlSchema.js                # GraphQL API implementation
    ├── resolver.js                     # Database migrations and seeds
    └── server.ts                       # Entry point to back end with hot code reload
├── .gitignore
├── package.json
├── webpack.config.js
└── tools                                            # All build and CLI-related files
```
Note that in a real application we would completely separate the client from the server: they both would have their own dependencies and package.json files. But for simplicity, we keep the application structure like the one shown above.
As a final step before we start building the application, let’s compare Apollo to GraphQL.
## Apollo vs GraphQL
How does Apollo compare to GraphQL? You might have already used the Fetch API, XMLHttpRequest, or some HTTP client to build AJAX requests to the back-end API. In particular, if you were building client-side applications with React, you might be familiar with Axios, one HTTP client that simplifies the use of Fetch API.
To put it in crude terms, GraphQL finds itself on the same level as Fetch, while Apollo Client is a wrapper around GraphQL just like Axios is for Fetch. We use apollo-boost, a library that includes all the Apollo parts necessary to build GraphQL queries and mutations on the client.
As for the server application, instead of using the `graphql` library to tediously create GraphQL types and mutations, we can benefit from Apollo Server to greatly simplify the work with GraphQL.
To give you a more concrete example of why using Apollo is great, have a look at at a typical GraphQL schema that you’d created with `graphql` on an Express server:
```javascript
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = require('graphql');

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // code to get data from db or other source
        return Post.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
```
Writing this amount of code can be very entertaining for the first couple of times. But in practice, we need to write concise code, so here’s how we can rewrite the previous code example using Apollo Server:
```javascript
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Post {
    title: String,
    content: String
  },
  type Query {
    posts: [ Post ]
  }
`;

const resolvers = {
  Query: {
    posts: () => Post.find({}),
  }
};

module.exports = { typeDefs, resolvers };
```
With all the obvious staff out of the way, we can focus on implementing our application, and we begin with the Apollo Server and Express part.
## Creating an Apollo and Express server
### Initializing an Express application and installing the dependencies
As with any project, we need to first initialize it. Start by running the commands below:
```bash
# Create a new GraphQL project
mkdir graphql-app
# Go into the project
cd graphql-app
# Initialize a new project
# Use the --yes flag to create package.json with defaults
yarn init --yes
```
As we’ve shown in the application structure, our client and server code will be stored in separate directories. For now, just create the `server` directory under `graphql-app`:
```bash
# Make sure you are in the graphql-app root folder
mkdir server
```
We have now the space for the Express server application. It’s time to install the server dependencies.
### Installing the dependencies for the Express server
Run the following two commands (separately) to install all the Express dependencies:
```bash
# Install basic Express application dependencies
yarn add express apollo-server-express mongoose
# Install nodemon to development dependencies
yarn add nodemon --dev
```
Naturally, the `express` package helps to create an Express server application. To create a GraphQL schema and resolvers with Apollo Server, `apollo-server-express` is necessary. We also install mongoose, a package that connects to MongoDB and can send requests to the database.
Finally, we recommend installing `nodemon`, an optional package, which is great in that it streamlines working with Express applications. Nodemon re-builds and re-runs the application whenever you change its code, and all the changes are immediately reflected in the application.
Notice that Express, apollo-server-express, and mongoose are all installed into `dependencies` in `package.json` (with NPM, you’d have to use the `--save-dev` or `-S` flag; Yarn uses the `--save` flag by default). Nodemon, however, needs to be installed into `devDependencies`, which is why the flag `--dev` was used.
### Installing MongoDB
You can skip over to Express application setup if you have already MongoDB installed and running. If not, run the following commands to install MongoDB (we use the commands for Ubuntu 18.04, but you can consult the official MongoDB documentation for other installation options):
```
# Import the public key used by the package management system
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
# Create a list file for MongoDB
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
# Reload local package database
sudo apt-get update
# Install MongoDB
sudo apt-get install -y mongodb-org
# Verify the status of MongoDB server
sudo systemctl status mongod
```
If you run the last command from the list above, you should see that MongoDB is up and running: `Active: active (running) since Tue 2019-01-08 08:33:00 EET; 51min ago`. However, if you see the message similar to this – ` Active: inactive (dead) since Tue 2019-01-08 09:27:25 EET; 10s ago`, then you need to run one of the commands below:
```bash
# Restart MongoDB
sudo service mongod restart
# Or always start MongoDB on the system startup
sudo systemctl enable mongod
```
Now that MongoDB is up and running, we need to set up the Express application.
### Express server setup
Create the `server.js` file under the `server` folder and add the basic code below:
```javascript
// #1 Import express and ApolloServer
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// #2 Import mongoose
const mongoose = require('./config/database');
// #3 Import GraphQL type definitions and resolvers
const typeDefs = require('./graphqlSchema');
const resolvers = require('./resolvers');

// #4 Create Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// #5 Create an Express application
const app = express();

// #6 Use the Express application as middleware in Apollo server
server.applyMiddleware({ app });

// #7 Set the port that the Express application will listen to
app.listen(3000, () => console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
```
Let’s explain what’s happening in the code snippet above.
First, we import `express` and `apollo-server-express` respectively to create an Express application and an instance of Apollo Server. We also import a mongoose instance from the `config/database.js` file to connect to MongoDB – the file doesn’t exist yet.
Next, we import the Apollo type definitions and resolvers – `typeDefs` and `resolvers`, the two key components that will let us use GraphQL. We create these components in the later sections.
We also create an Apollo server and pass it the `typeDefs` and `resolvers`. The Express application must be passed as a middleware to the Apollo server. Finally, we set the application port and log out a message when the Express application is up and running.
Provided that you installed nodemon, you can add the following script to the `package.json` file:
```json
{
    "server": "nodemon server/server.js"
}
```
And if you decided not to use nodemon, add the following command instead:
```json
{
    "server": "node server/server.js"
}
```
Remember that with the command "node server/server.js", you have to manually stop the application and run it again if you change anything in code to see the latest changes.
You _can_ run the Express server right now, but the console will yell with the errors – the Mongoose instance, type definitions, and resolvers don’t exist yet. Let’s create them.
### Creating a Mongoose instance
We need to connect our Express application to a MongoDB instance, and mongoose will helps us.
Create a new directory `config` under `server` and add the `database.js` file with the following code to that directory:
```javascript
// The file server/config/database.js
// #1 Import mongoose
const mongoose = require('mongoose');

// #2 Create a query string to connect to MongoDBserver
const DB_URI = 'mongodb://localhost:27017/apollo-app';

// #3 Connect to MongoDB and add a couple of basic event listeners
mongoose.connect(DB_URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log('Connected to a MongoDB instance'));
mongoose.connection.on('error', error => console.error(error));

// #4 Export mongoose. You’ll use it in server/server.js file
module.exports = mongoose;
```
In the code above, we require mongoose, use a sort of default URI to connect to the `apollo-app` database in MongoDB (there’s no need to manually create a database – it’ll be created automatically when you send first mutation query from the Express application).
Next, we connect to the database using the `DB_URI` request string and the `mongoose.connect()` method. Also, we set the `{ useNewUrlParser: true }` to remove the warning `DeprecationWarning: collection.ensureIndex is deprecated`, which may produce with the latest mongoose versions.

We also add a couple of event listeners for the 'open' and 'error' events to log out the messages when Mongoose connects to the database.
Now if you run the Express application, it’ll we able connect to MongoDB through the mongoose instance. Although the application will still crash because there’s no GraphQL schema with type definitions and resolvers.
### Creating a GraphQL schema for posts
To be able to use GraphQL, we need to create a GraphQL schema. For a recap, you can think of GraphQL schema as of an object that contains the descriptions of the types, queries, and mutations. In the simplest terms, types describe what kind of objects with what fields we can return to the client application. Queries define what client requests with what data the Express server must respond to. Mutations determine how the new data is updated or added.
We use Apollo to create a GraphQL schema. First, add a new file `graphqlSchema.js` with the following code under the `server` directory:
```javascript
// #1 Import the gql method from apollo-server-express
const { gql } = require('apollo-server-express');

// #2 Construct a schema, using the GraphQL schema language
const typeDefs = gql`
  # Define the type Post with two fields
  type Post {
    title: String,
    content: String
  },
  # Define the query type that must respond to 'posts' query
  type Query {
    posts: [Post]
  },
  # Define a mutation to add new posts with two required fields
  type Mutation {
    addPost(title: String!, content: String!): Post,
  }
`;

module.exports = typeDefs;
```
To create type definitions, we need to use the `gql` method from the `apollo-server-express` package and put a string after it with a schema description.
First, we create a type Post. Since we’re building an application to show posts, we need to tell GraphQL that we’ll be passing around post objects. Each post, as you can see from the type definition of Post, will contain three fields – an ID, a title, and a content. Each field must also have the types: the title and content are both strings, and the ID has the custom GraphQL type `ID`.
Second, we need to create a query. In terms of RESTful design, you can understand this `type Query` as our actual endpoint, and we can rewrite this query in REST the following way:
```js
const query = gql`
    type Query {
        posts: [ Post ]
}`;
// Using an Express built-in router
router.get(`posts`, (req, res) => { // Code that handles the GET request for `posts` });
```
Also notice that the response from the server will be an array of posts, which is why we pass `[ Post ]` as the type to the `posts` property on query.
Finally, we need to create a mutation – we want to save users’ posts, don’t we? The mutation will contain the method `addPost(title: String!, content: String!): Post`, which will accept a new post’s title and content and return the Post type after a post was saved to the database.
Note that by using the exclamation marks for the parameters in `addPost()` method we specify that both title and content for posts must be given. In other words, when you’ll be sending a request from the client application, your POST requests to create a post must contain the title and content. Otherwise, you’ll get an error.
The last step we need to do is export the type definitions – `module.exports = typeDefs;` – to use them in the Apollo server that we’ve created before.
It’s time to create resolvers that’ll process our queries and mutations.
### Implementing GraphQL resolvers with Apollo
Our GraphQL schema contains the queries and mutations, but they don’t really do anything. To actually handle the client requests, the server needs resolvers, which are just functions that connect to the database to retrieve or mutate the requested data.
To store our resolvers, let’s create the `resolvers.js` file under the `server` directory. The code snippet below has two groups of resolvers – Query and Mutation, which actually contain the methods to return or mutate posts:
```javascript
// #1 Import the Post model
const Post = require('./models/post');

// #2 Create resolver functions that will handle GraphQL requests
// The Query fields must correspond to the query created in schema – posts
const resolvers = {
  Query: {
    // Query which returns posts list
    posts: () => Post.find({}),
  },

/**
 * Mutation which provides functionality for adding posts.
 * The mutation methods should also return the created object.
 */
  Mutation: {
    addPost: (_, post) => {
                const post = new Post({ title: post.title, content: post.content });
                return post.save();
    }
  }
};
module.exports = resolvers;
```
In the code snippet above, we use the mongoose `Post` model to get all the posts from MongoDB using the `find()` method. We create the `Post` model in a later section. For now, let’s focus on the resolvers.
When we need to get data from a database, we need to specify the `Query` property that’ll contain the resolvers for all the query types that we listed in the GraphQL schema. In other words, in `resolvers.js` the `Query` object has the property `posts`, which corresponds to the query `posts` in GraphQL schema. Apollo will simply use the resolver function `Query.posts()` to get and serve posts when the `posts` query was sent from the client.
Similarly, when we need to save a new post – to mutate the application state – we need to add a dedicated `addPost` resolver to the Mutation object. The `addPost()` method accepts two parameters (in fact, it can accept up to four parameters, but we don’t need all of them for the purpose of this guide). We don’t need to use the first parameter `parent`; for the sake of information, `parent` refers to the parent resolver when you have nested resolvers. The second parameter is the post data sent by the client application. We can use these data to create a new post instance and save it to the database.
Pay attention that mutations should return the object that was created. The arrow functions in JavaScript implicitly return a value, which is a new post object (strictly speaking, the `Post` constructor returns a Promise, which automatically gets unwrapped to the post object on the client).
By this time, we’ve created a GraphQL schema with type definitions. We also have resolvers to handle queries and mutations. The last thing we need to do is create a mongoose model to get posts from and save new posts to the database.
### Creating a mongoose model for posts
Using mongoose, we can handle posts by creating a post schema and a post model. Don’t confuse a GraphQL schema and a Mongoose schema – these are two different objects that serve different purposes.
Here’s the code for a simplistic mongoose schema and model for posts. Notice that first we need to describe a schema, using which we can then create a model:
```javascript
const { Schema, model }  = require('mongoose';
const postSchema = new Schema({
    title: String,
    content: String
});
const Post = model('post', postSchema);
module.exports = Post;
```
Creating a Mongoose schema is very simple: we just need to use the `Schema` constructor and pass it the properties of the objects that we’ll be creating. In our case, each post object must contain just two fields of  string type. Notice that we don’t create a field ID – MongoDB will conveniently create the ID automatically for each post.
To create a new model, it’s enough to use the `model()` method with the name of our model and the post schema. When creating a new instance of the `Post` model, you’ll need to pass two values into it – a title and content, which you’ll get from the mutation resolver parameters:
```
Mutation: {
    addPost: (_, post) => {
                // The Post gets the object with title and content parameters
                // The actual values are provided by the post parameter
                // passed to the mutation addPost
                const post = new Post({ title: post.title, content: post.content });
                return post.save();
    }
  }
```
Internally, when you first create a new instance of `Post` and save it to the database, mongoose will automatically create a collection `posts` in the `apollo-app` database and will save each post as a separate document into that collection.
___
Let’s recap what we’ve created so far:
* A very simple Express application
* An instance of Apollo Server to handle GraphQL on the server
* A connection to a MongoDB instance using Mongoose
* A GraphQL schema with queries and mutations using Apollo
* GraphQL resolvers to get posts from the database and save new posts
* A `Post` model to handle creation and retrieving of posts from the database
It’s time to start building a React application that will connect to our Express server using Apollo Client.
## Step 2. Creating React and Apollo client application
We use the following structure for the React application: all the code is stored under the folder `client`.
```
graphql-app
├── client                              # The frontend package
│   └── src                             # All the source files of the React app
│     ├── modules                       #
│     │   ├── post                      # The Post module
│     │   │   ├── containers
│     │   │   │   └── index.js
│     │   │   ├── providers
│     │   │   │   ├── index.js
│     │   │   │   └── PostsList.js
│     │   │   ├── styles
│     │   │   │   └── styles.css        # The styles for the Post module
│     │   │   └── index.js
│     │   └── index.js                  # Entry point for the Post module
│     ├── settings
│     │   └── createApolloClient.js
│     ├── App.js
│     ├── index.html
│     └── index.js
├── node_modules                        # Global Node.js modules
├── .gitignore
├── package.json
└── webpack.config.js
```
### Installing dependencies for React application
We need to install a handful of dependencies to be able to run our React application. We install them by groups and explain what each dependency does.
Since we use webpack to build the React application, we need all the webpack dependencies along with loaders and plugins to development dependencies.
```bash
# Run from the root
yarn add webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader babel-loader --dev
```
Besides the webpack dependencies, it’s also necessary to install two Babel dependencies that are required by `babel-loader` to transpile React code into JavaScript:
```bash
yarn add @babel/core @babel/preset-react
```
After installing all the dependencies, we can configure webpack.
### Configuring webpack for a React application
You need to create `webpack.config.js` under the project’s root and add the code below. Note that we intentionally keep the webpack configuration minimal:
```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlWebPackPlugin({
  template: './client/src/index.html'
});

module.exports = {
  entry: './client/src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }

      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [ htmlPlugin ]
};
```
### Installing React and Apollo dependencies
The preliminary installation is complete and we can now move on to installing React and `react-dom`:
```bash
yarn add react react-dom
```
Optionally, you can also install a UI toolkit – we use `reactstrap` – to add Bootstrap components to the application. The other necessary package is Bootstrap to add generic styles to the application:
```bash
yarn add reactstrap bootstrap
```
Finally, to be able to use GraphQL, we need to install another two dependencies:
```bash
yarn add apollo-boost react-apollo
```
Apollo Boost is an all-in-one package provided by Apollo to let us build queries and mutations on the client. We also need the `react-apollo` library that provides custom GraphQL components to wrap React components. This will let us get access data from the server from inside the React components.
Before we actually start creating the React application, let’s also add a script to run the future React application:
```json
{
    "scripts": {
        "client": "webpack-dev-server"
    }
}
```
If you try to run the React application, you’ll get an error because we haven’t actually built anything yet.
### Initializing a React application
We can finally move on to building our client application with React.
If you haven’t done this already, you need to create the `client/src` folder under the root directory of the project. Inside the `src` folder, create the other two directories: `settings` to store the Apollo configurations, and `modules` to store our post module.
Next, create the `index.html` file and add the following HTML code, typical for React applications:
```html
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Apollo, React, and Express Example Application</title>
  </head>

  <body>
    <div id="root"></div>
  </body>

</html>
```
Next, let’s create the entry point for the application – the `client/src/index.js` file. Add the following code to bootstrap the React application:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById(root));
```
The only thing missing in `index.js` is the `App` component. Let’s create it.
### Creating main React component App.js
`App` will render posts module. The entire application must also be wrapped in a custom Apollo Provider component, which is necessary to make possible to use Apollo Client throughout the application.
Add the following code to `App.js`:
```javascript
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo';
import apolloClient from './settings/createApolloClient';
import { Posts } from './modules';

class App extends Component {
  render() {
    return (
          <ApolloProvider client={apolloClient}>
                <Posts />
          </ApolloProvider>
    )
  }
}

export default App;
```
As you can see, besides the basic React dependencies – `React` and `Component`, we need to import `ApolloProvider`, the instance of Apollo Client, and the Posts module.
The Apollo provider, imported from `react-apollo`, is just a React component that wraps our entire React application. The provider needs an instance of Apollo Client to work – note the `<ApolloProvider client={apolloClient}>` line. Apollo Client is just a configuration object that will tell our application where to send requests.
Let’s move on step by step: First, we’ll create Apollo Client for our application, and after that we’ll focus on the Posts module.
### Initializing Apollo Client
We need to initialize a new Apollo Client. Add the `createApolloClient.js` file with the following code under the `client/src/settings` directory:
```javascript
import ApolloClient from "apollo-boost";

const apolloClient = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

export default apolloClient;
```
There’s nothing special going on. The React application simply needs a URL that it will query; the URL is the endpoint handled by the Express application. Note that we send all requests to `/graphql`.
### Implement the Posts module
The next step is creation of our Posts module. The Posts module structure looks like this:
```
graphql-app
├── client                              # The frontend package
│   └── src                             # All the source files of the React app
│     ├── modules                       #
│     │   ├── posts                     # The Post module
│     │   │   ├── containers
│     │   │   │   └── index.js
│     │   │   ├── providers
│     │   │   │   ├── index.js
│     │   │   │   └── PostsList.js
│     │   │   ├── styles
│     │   │   │   └── styles.css        # The styles for the Post module
│     │   │   └── index.js
│     │   └── index.js                  # Entry point for the Post module
```
Under the `client/src/modules` folder, create a new directory `posts`. This directory will contain three other directories:
* `containers`, all the dumb components that only render various application parts
* `providers`, contains the higher-order Posts components that will carry out GraphQL queries
* `styles`, contains the styles for the module
Let’s first add the basic files to the `providers` directory.
#### Creating PostList Higher Order Component
Because we’ll have many posts published on the website, we need to create the `PostsList` component. This component will query the server application to get the list of posts and return the data into the child component for rendering.
Add the code below to `providers/PostsList.js` file:
```javascript
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

export const GET_POSTS = gql`
  {
    posts {
      id
      title
      content
    }
  }
`;

const withPosts = Component => props => {
  return (
    <Query query={GET_POSTS}>
      {({ loading, data }) => {
        return (
          <Component postsLoading={loading} posts={data && data.posts} {...props} />
        );
      }}
    </Query>
  );
};

export default withPosts;
```
As you can see, the `GET_POSTS` constant contains our query. To create a query, you need to use a `gql` method from `apollo-boost`. Note the syntax: immediately after `gql` you need to use the backticks and add a query there. We need to get a post’s ID, title, and content, and accordingly we build a GraphQL query.
Note that you can have many providers in the future, and so it’s best to create an `index.js` file under `providers` and export all providers this way:

```javascript
export { default as withPosts } from './PostsList';
```

### Creating AddPost High Order Component

Далее нам нужно создать компонент высшего порядка. Этот компонент будет выполнять мутацию, которая запишет новый пост в список и перезагрузит список постов на клиентской части. Для этого в папке `providers` мы создаем файл `AddPost.js` и добавляем туда следующий код.

```javascript
import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { GET_POSTS } from "./PostsList";

export const ADD_POST = gql`
  mutation($title: String!, $content: String!) {
    addPost(title: $title, content: $content) {
      title
      content
    }
  }
`;

const withAddPost = Component => props => {
  return (
    <Mutation mutation={ADD_POST}>
      {addPost => {
        return (
          <Component addPost={({ title, content }) => addPost({
            variables: { title, content }, refetchQueries: [
              { query: GET_POSTS }
            ] })}
          />
        )
      }}
    </Mutation>
  );
};

export default withAddPost;

```

Теперь экспортируем новый провайдер из файла `index.js` который находится в папке `providers`.

```javascript
export { default as withPosts } from './PostsList';
export { default as withAddPost } from './AddPost';
```

### Creating a container component for rendering posts
Now that we can query the server and get posts, we need to add a container to render the retrieved posts. Create the `PostList` component under the `client/src/modules/posts/containers` directory with the following code:
```javascript
import React, { Component } from 'react'
import PostList from './PostList';

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
 * Wrap the Posts component using withPosts provider
 * for getting posts list in the Posts component.
 */
export default withPosts(PostsRoot);
```
Next, we need to export our main component that’s located under the `containers` directory. We need to create the `index.js` file under `posts` and export the `Posts` component.
```javascript
export { default as Posts } from './containers';
```

Because we can have many modules, we also need to create the `index.js` file under `modules` to be able to export them:

```javascript
export { Posts } from './post';
```

## Final stitches

You may not want to run the React and Express applications separately. We can use a dedicated package called `concurrently` that will run two scripts at the same time. Add `concurrently` to the development dependencies in your `package.json`:
```bash
yarn add concurrently --dev
```
Now, add another script into the `package.json` to run the client and server applications at the same time:
```json
{
    "scripts": {
    "server": "nodemon ./server/server.js",
    "client": "webpack-dev-server --mode development --open",
    "dev": "concurrently \"npm run client\" \"npm run server\""
      }
}
```
Our Apollo, React, Express application is ready and you can run it with the following command:
```bash
yarn dev
```
The server and client applications will run simultaneously, and you can try out the built functionality.
