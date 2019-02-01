# How to Create an Apollo, React, and Express application

Creating a React, Express, and Apollo (GraphQL) application can be a serious challenge, and while there are tools like
<a href="https://github.com/sysgears/create-apollo-app" title="A Command Line tool to generate Apollo, Express, React,
React Native applications" target="_blank">Create Apollo App</a> that simplify generation of a boilerplate project with
these technologies, it’s best to have a clear understanding how such an application can be built.

In this tutorial, we show how to create a modular application with the MongoDB, Express, React, Node.js (MERN) stack
that uses Apollo, a popular GraphQL implementation for JavaScript applications.

You can have a look at the implemented application in this repository:

* <a href="https://github.com/sergei-gilevich/react-apollo-express-example" target="_blank">A MERN application with Apollo GraphQL</a>

Before we dive deep into the implementation details, we want to give a bird view on what this MERN application powered 
by Apollo will look like.

## An overview of Apollo, React, and Express application

You’re going to build an application that'll display posts, fetch them from a backend API, and sends new posts to the
server to save them in the database.

To implement this application, you'll:

* Create an Express server application that uses Apollo Server;
* Connect the server to MongoDB using Mongoose;
* Build a React client application that uses Apollo Client; and
* Create a Post module on both client and server to handle posts.

Throughout the project, we install and handle the dependencies with Yarn, but you can use NPM as well. We also
recommend using the latest stable version of Node.js, although any version starting from Node.js 6 will make it.

We assume that you already have basic understanding of React, Express, MongoDB, and GraphQL. And even if you’re not
familiar with these technologies, with the detailed explanation we give on each code snippet you’ll be able to grasp how
the application works.

Besides the MERN plus Apollo stack, we use Reactstrap components such as Container, Button, Form, FormControl, and
others to create layouts with generic Bootstrap styles.

Next, let's review the project structure.

### Express, React, Apollo application structure

Most tutorials provide simplified structure for Express, React, and Apollo applications with the idea to focus on the
implementation rather than how the project looks. However, we're going to show modular approach to bring this
application closer to real-world projects.

Here’s what the application structure looks like:

```
apollo-app
├── client                     # The client package
│   └── src                    # All the source files of the React app
│       ├── config             # The React application settings
│       ├── modules            # The client-side modules
│       ├── App.js             # The React application's main component
│       ├── index.html         # React application template
│       └── index.js           # React application entry point
├── node_modules               # Global Node.js modules
├── server                     # The server package
│   ├── config                 # The Express application configurations
│   ├── modules                # Server modules
│   └── server.js              # The Express application's entry point
├── package.json               # Project metadata and packages
└── webpack.config.js          # Webpack configuration for React
```

The application will have two separate directories &mdash; `server` and `client` &mdash; to store the server and client
files respectively. This structure also has a single `package.json` file, which will contain all the dependencies. In a
real-world application, however, we recommend that you completely separate the client from the server so they have their
own dependencies and `package.json` files. We don't create two `package.json` files for simplicity.

Now, we can focus on implementing the application, and we start off with installing MongoDB. After that, we switch to
creating an Express server application that uses Apollo Server to handle GraphQL requests. In the last section, we
review the React application that uses Apollo Client and `react-apollo` to handle GraphQL.

## Installing MongoDB

You can <a href="#initializing-express-react-apollo-application">skip over to creating the application</a> if you
already have MongoDB installed and running. If not, run the following commands to install MongoDB. Note that we use the
commands for Ubuntu 18.04, and you need to consult the
<a href="https://docs.mongodb.com/manual/installation/#mongodb-community-edition" target="_blank"
title="MongoDB Community Edition installation options">official MongoDB documentation</a> for the other installation
options:

```sh
# #1 Import the public key used by the package management system
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

# #2 Create a list file for MongoDB
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

# #3 Reload local package database
sudo apt-get update

# #4 Install MongoDB
sudo apt-get install -y mongodb-org
```

Once the installation is complete, you can check if the MongoDB server is up and running:

```sh
# Verify the status of MongoDB server
sudo systemctl status mongod
```

After running the command, you should see a message similar to this: `Active: active (running) since Tue 2019-01-08 08:33:00 EET; 51min ago`.
However, if you see the message `Active: inactive (dead)`, then you need to run one of the commands below:

```sh
# Restart MongoDB
sudo service mongod restart

# Or always start MongoDB on the system startup
sudo systemctl enable mongod
```

The first command restarts the MongoDB server, while the second command configures MongoDB to always run on the system
startup.

Now we can focus on creating the application.

## <a name="initializing-express-react-apollo-application"></a> Initializing an Express, React, Apollo application

Initialize a new project by running the commands below:

```bash
# #1 Create a new folder for the project
mkdir apollo-app

# #2 Go into the project
cd apollo-app

# #3 Initialize a new project
# Use --yes to create a default package.json
yarn init --yes
```

You get a directory `apollo-app` (or whatever you named it) and a `package.json` file with some default project
metadata. (Our choice for the project name is dictated by the application design: This application uses Apollo with
GraphQL instead of a traditional RESTful approach.)

In the next section, you'll create an Express application with Apollo Server.

## Creating an Express application with Apollo Server

An Express application you're going to build has the following structure:

```
apollo-app
├── server                              # The server package
│   ├── config                          # The Express application configurations
│   │   └── database.js                 # Mongoose configurations
│   ├── modules                         # Server modules
│   │   └── post                        # The Post module
│   │       ├── models                  # Mongoose models for Post module
│   │       │   └── post.model.js       # Mongoose Post model
│   │       ├── graphqlSchema.js        # GraphQL types and mutations
│   │       └── resolvers.js            # GraphQL resolver functions
│   └── server.js                       # The Express application entry point
```

The `server.js` is an entry point for this Express application; in this file, an Express app and Apollo Server are
initialized. The `config` folder will contain all the Express application configurations. For example, the mongoose
configurations will be stored in `server/config/database.js`.

The server application also has the `modules` folder to store all Express modules. In this application, there's just one
module Post, which will have a `Post` model, a GraphQL schema created with Apollo Server, and resolvers to handle
GraphQL queries. Similarly, you can create other server modules under `modules` with their own models, schemas, and
resolvers.

Let's create an Express server application with this structure.

### <a name="installing-dependencies-for-express"></a> Installing dependencies for an Express server

Run the following command to create the `server` directory under the root `apollo-app`:

```bash
# Make sure you are in the apollo-app root folder
mkdir server
```

That’ll create a space for an Express server application. It’s time to install a few dependencies for Express, Apollo,
and MongoDB.

Run the following two commands in succession to install all the Express dependencies that the application needs:

```bash
# #1 Install the basic Express application dependencies
yarn add express apollo-server-express graphql mongoose

# #2 Install nodemon to development dependencies
yarn add nodemon --dev
```

Let’s clarify what all these packages are used for. Naturally, `express` creates an Express server application. To build
a GraphQL schema and resolvers with Apollo Server, `apollo-server-express` must be installed with `graphql`. Finally,
you need to install `mongoose`, a package that connects to and can query a MongoDB database.

With the second command, you install `nodemon`, an optional package, which is great in that it simplifies your work
with Express applications &mdash; `nodemon` automatically re-builds and re-runs the application whenever you change its
code.

### Creating a script to run an Express app

Provided that you installed nodemon, you can add the following script to the `package.json` file:

```json
{
  "scripts": {
    "server": "nodemon ./server/server.js"
  }
}
```

Next, we create `server.js`.

### Creating an entry point for an Express server application

Create `server.js` under the `server` folder and add the basic code below:

```javascript
// #1 Import Express and Apollo Server
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// #2 Import mongoose
const mongoose = require('./config/database');

// #3 Import GraphQL type definitions
const typeDefs = require('./modules/post/graphqlSchema');

// #4 Import GraphQL resolvers
const resolvers = require('./modules/post/resolvers');

// #5 Create an Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// #6 Create an Express application
const app = express();

// #7 Use the Express application as middleware in Apollo server
server.applyMiddleware({ app });

// #8 Set the port that the Express application will listen to
app.listen({ port: 3000 }, () => {
  console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
});
```

Let’s explain what’s happening in the code snippet.

First, we import `express` and `apollo-server-express` to be able to create an Express application and an instance of
Apollo Server respectively. We also import a mongoose instance from the `config/database.js` file to connect to MongoDB
&mdash; the file doesn’t exist yet, but we'll create it soon.

Next, we import the Apollo type definitions and resolvers &mdash; `typeDefs` and `resolvers`. They’re the two key
components necessary for Apollo to work. We also create these components in the later sections.

After importing the dependencies, we create an instance of Apollo Server and pass it the `typeDefs` and `resolvers`. An
Apollo server will then be able to handle GraphQL queries coming from the client application and using suitable GraphQL
types and resolvers.

Notice that the Express application must be passed as middleware to the Apollo server. That's necessary so that once
Apollo handles GraphQL queries, it can cede the control to Express.

Finally, we set the application port and log out a message when the Express application is up and running.

You might run the Express server right now, but the console will yell with errors: a mongoose instance, type
definitions, and resolvers don’t exist. So let's create them.

### Creating a mongoose instance

To connect to MongoDB, you first need to configure mongoose. The database configs will be kept in a dedicated folder
`server/config`. Create `database.js` with the following code under `server/config`:

```javascript
// The file server/config/database.js
// #1 Import mongoose
const mongoose = require('mongoose');

// #2 Create a query string to connect to MongoDB server
const DB_URI = 'mongodb://localhost:27017/graphql-app';

// #3 Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true });

// #4 Add basic event listeners on the mongoose.connection object
mongoose.connection.once('open', () => console.log('Connected to a MongoDB instance'));
mongoose.connection.on('error', error => console.error(error));

// #5 Export mongoose. You’ll use it in server/server.js file
module.exports = mongoose;
```

In the code above, we first require mongoose and create a sort of default URI `mongodb://localhost:27017/apollo-app` to
connect to the `apollo-app` database in MongoDB. There’s no need to manually create this database: MongoDB will create
it automatically once you send your first query using mongoose. You can choose any name for a database; we decided to
name it `apollo-app`, the same as the project.

After requiring mongoose and creating a URI, the application connects to the database by calling the
`mongoose.connect()` method. You must passing `DB_URI` as the first argument to `connect()`. Also, pass a second
argument `{ useNewUrlParser: true }` to enable mongoose’s URL parser. This argument is necessary to remove the warning
`DeprecationWarning: current URL string parser is deprecated`, which may produce with the latest mongoose versions.

We also add a couple of event listeners for the `open` and `error` events on the `mongoose.connection` object, which you
can understand as a _database the application connected to_, and log out a couple of messages.

Now, if you run the Express application, it’ll we able connect to MongoDB using the mongoose instance: recall the line
`const mongoose = require('./config/database');` in `server.js`.

The post module we create next.

### Creating a post module for server application

Because the application has modular structure, you need to create a new folder `modules` under `server` to keep all the
backend modules in one place. And since each module should be stored in its own folder, create `modules/post` for the
Post module. Now you have `server/modules/post` to store all files relevant for the module. We create a mongoose `Post`
model, GraphQL schema, and resolvers one by one in the following sections.

#### Creating a mongoose model for posts

With mongoose, creating a model to query MongoDB for data is easy. You first need to describe a mongoose schema to
specify the fields that each new object must have. After that, you can create a model using the `model()` method, and
the model will be used to create new objects to be stored in the database.

We suggest that you store all models under `server/modules/{module}/models` directories. For this reason, the Post
module will have its models under `server/modules/post/models`.

Here’s the code for a simple mongoose schema and model for posts:

```javascript
// #1 Import the constructor Schema and the model() method
// Note the use of ES6 desctructuring
const { Schema, model }  = require('mongoose');

// #2 Create a post schema using mongoose Schema
const postSchema = new Schema({
  title: String,
  content: String
});

// #3 Create a post model with mongoose model() method
const Post = model('post', postSchema);

module.exports = Post;
```

As you can see, a mongoose Schema class is used with an object parameter. In case with posts, the object parameter sets
the two fields &mdash; `title` and `content` &mdash; both of types `String`.

To create a new model, it’s enough to call the mongoose `model()` method passing it a model name as the first argument
and a schema as the second argument. The model name must be singular and lowercase letters: `'post'`. Mongoose, however,
will create the _posts_ collection (note the plural form) in the `apollo-app` database.

There are no resolvers with a GraphQL schema. Let's build them.

#### Creating a GraphQL schema for posts

Let’s first recap how GraphQL works. GraphQL needs a schema to understand how to retrieve and save data (posts in this
application). Don’t confuse a _GraphQL_ schema and a _mongoose_ schema, though! These are two different objects that
serve different purposes.

You can think of a GraphQL schema as of an object that contains the descriptions of the types, queries, and mutations:

* Types define the shape for data that the server and client send back and forth.
* Queries define how the Express server must respond to the client’s GET requests.
* Mutations determine how the new data is created or updated.

With the obvious stuff out of the way, we can switch to creating a GraphQL schema for the Post module using Apollo.

Add a new file `graphqlSchema.js` under the `server/modules/post` folder. Add the following code to the file:

```javascript
// #1 Import the gql method from apollo-server-express
const { gql } = require('apollo-server-express');

// #2 Construct a schema with gql and using the GraphQL schema language
const typeDefs = gql`
  #3 Define the type Post with two fields
  type Post {
    _id: ID,
    title: String,
    content: String
  },
  #4 Define the query type that must respond to 'posts' query
  type Query {
    posts: [Post]
  },
  #5 Define a mutation to add new posts with two required fields
  type Mutation {
    addPost(title: String!, content: String!): Post,
  }
`;

module.exports = typeDefs;
```

To create type definitions, Apollo's `gql` method is used.

First in the schema description, we create a type `Post` to tell GraphQL that we’ll be passing around post objects. Each
post will have three fields &mdash; an ID, a title, and a content. Each `Post` field must have its own type, and so we
used an `ID` type for `_id` and a `String` type for `title` and `content`.

Second, the schema contains a query type. In terms of the RESTful design, you can understand `type Query` as an endpoint
GET for a URL `http://my-website.com/posts`. Basically, with `type Query { posts: [Post] }` you say, _"My Express server
will be able to accept GET requests on `posts`, and it must return an array of Post objects on those GraphQL requests."_

Our GraphQL schema also has a mutation `addPost()` to save users’ posts. This mutation specifies that it needs the
frontend application to send a new post’s title and content. Also, an object of the `Post` type will be returned once
this mutation is done.

You might have noticed that the mutation doesn’t use the `_id` field, but you don’t have to create this field on the
frontend as MongoDB automatically generates an ID for each document you insert into a database, and that ID will be sent
from the server to the client.

It’s time to create the second part of the parameter object, resolvers, which must be passed to `ApolloServer` to
process the queries and mutations described in this schema.

#### Implementing GraphQL resolvers with Apollo

A GraphQL schema with queries and mutations doesn’t really do anything other than outlining what data types are
available and how to respond to different HTTP requests. To actually handle the client requests, Apollo Server needs
resolvers, which are just functions that retrieve or mutate the requested data.

The Post module needs another file to store its resolvers, `resolvers.js`, which you can add next to `typeDefs.js` under
the `server/modules/post` directory.

The code snippet below has two groups of resolvers, Query and Mutation. Also notice the imported mongoose Post model
that you’ve already created, which is necessary to work with posts that are stored in MongoDB:

```javascript
// #1 Import the Post model created with mongoose
const Post = require('./models/post');

// #2 Create resolver functions to handle GraphQL queries
/**
 * Query resolver "posts" must return values in response to
 * the query "posts" in GraphQL schema.
 */
const resolvers = {
  Query: {
    // Query which returns posts list
    posts: () => Post.find({}),
  },

/**
 * Mutation resolver addPost creates a new document in MongoDB
 * in response to the "addPost" mutation in GraphQL schema.
 * The mutation resolvers must return the created object.
 */
  Mutation: {
    addPost: (parent, post) => {
      // Create a new post
      const newPost = new Post({ title: post.title, content: post.content });
      // Save new post and return it
      return newPost.save();
    }
  }
};

module.exports = resolvers;
```

Let’s focus on the resolvers.

First, you create an object with two fields &mdash; `Query` and `Mutation`. When you want to respond back to the client
using Apollo, you need to specify the `Query` property with one or several resolvers for all the query types listed in a
GraphQL schema. In our application, `Query` needs only one resolver `posts()` to respond to the query `posts` defined in
`./post/graphqlSchema.js`. `posts()` will then request MongoDB for posts using the `Post` model’s `find()` method, which
is available on all mongoose models.

Similarly, when you’re saving a new post with Apollo, you need to add a dedicated `addPost()` resolver to the `Mutation`
property. The `addPost()` resolver accepts two parameters (in fact, it can accept up to _four_ parameters according to
Apollo documentation, but we don’t need all of them for our example).

The first parameter in `addPost()`, called `parent`, refers to the parent resolver when you have nested resolvers. This
parameter isn’t used for this mutation. The second parameter is the post data sent by the client application, and this
data can be passed to a mongoose model when instantiating new posts:
`new Post({ title: post.title, content: post.content })`.

Pay attention to the code inside `addPost()`. Just instantiating a new document with a mongoose model doesn’t save it to
the database, and you have to additionally call the model method `save()` on the newly created object. Also remember
to return the object in the mutation resolver so that Express sends it back to the client (`save()` returns a new
document after saving it to MongoDB).
___

Let’s recap what you’ve created so far:

* A very simple Express application
* An instance of Apollo Server to handle GraphQL on the server
* A connection to a MongoDB instance with mongoose
* A Post module with a model, GraphQL schema, and mutations

This is what the console output should produce when you now run the Express application with `yarn server`:

```sh
λ yarn server
yarn run v1.13.0
$ nodemon server/server.js
[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server/server.js`
Server is running on http://localhost:3000/graphql
Connected to MongoDB
```

It’s time to start building a React application that will connect to the Express server using Apollo Client.

## Creating a client application with React and Apollo Client

To store the React application code, you need to create the `client/src` folder under the root:

```sh
# apollo-app root folder
mkdir client
cd client
mkdir src
```

We again start with a discussion over the modular structure for the React application. You can skip the next section and
<a href="#installing-dependencies-for-react">start building the application React</a>, though.

### React and modular architecture

In most cases, you build a React application like this: You create an entry point `index.js`, a root component `App`,
and a `components` folder to store all kinds of React components. But the client application in this guide will have
different structure reflecting the modular approach we used for our server application:

```
graphql-app
├── client                                  # The frontend package
│   └── src                                 # All the source files of the React app
│       ├── modules                         # The React modules
│       │   ├── post                        # The Post module
│       │   ├── user                        # The User module
│       │   └── auth                        # The Authentication module
│       ├── config                          # React application configurations
│       │   └── createApolloClient.js       # An Apollo Client instance
│       ├── App.js                          # The React application root component
│       ├── index.html                      # The React application HTML layout
│       └── index.js                        # The entry point for React application
```

The application will have the `modules` folder with individual folders for each module: Post, User, and Auth. (We build,
however, only a Post module in this guide.) Additionally, the folder with all modules must contain an `index.js` file
that exports them:

```javascript
export { Posts } from './post';
export { User } from './user';
export { Auth } from './auth';
```

You can then import all the modules into `App.js` and add them to the root component to be rendered.

Recalling that life isn't all beer and skittles, we make the structure even more complex by creating several folders in
each module to keep module files grouped by their purpose.

This is what the Post module look like (and other modules should be created with the same structure in mind):

```
modules
├── post
│     ├── components
│     ├── containers
│     ├── providers
│     ├── styles
│     └── index.js
```

Let’s clarify what's what in the module:

* The `components` folder contains separate module components. Their only purpose is to render parts of the module. In
our application, `components` will store `PostList` and `PostForm` React components.
* `containers` will have just one file `index.js` with a root module container to render the module components.
`index.js` will therefore import all the necessary components from `components`.
* `providers` will contain wrappers for components. Because components shouldn’t query a server application for data,
you should delegate this responsibility to providers. Recall the Separation of Concerns design principle, and it’ll
become clear why we use providers.
* `styles` will contain a `styles.css` files with module styles.
* `index.js` exports an entire module.

Although the approach of creating complicated modular structure may seem useless and mind-blowing for a small React
application, it’ll bear fruits when your application grows. It’s a good idea to have good structure from the very
beginning of application development.

You can now focus on creating the React application.

### <a name="installing-dependencies-for-react"></a> Installing React, Apollo, and webpack dependencies

You need to install quite a few dependencies to be able to run a React application.

For starters, since the React builds will be created with webpack, install the webpack dependencies along with loaders
and plugins to development dependencies (read: `devDependencies` in `package.json`).

```sh
# Run from the root
yarn add webpack webpack-cli webpack-dev-server --dev
```

The `webpack` and `webpack-cli` are the basic dependencies necessary to build bundles with webpack, and
`webpack-dev-server` is necessary to serve the frontend applications.

Now install these dependencies:

```
yarn add html-webpack-plugin css-loader style-loader babel-loader --dev
```

With `html-webpack-plugin`, you can automate creation of the `index.html` root layout for the React application; this
plugin automatically adds the `index.js` entry point to the `script` tag in the layout. The React application also needs
two loaders for handle CSS &mdash; `style-loader` and `css-loader`.

`babel-loader`, which traspiles React code to valid JavaScript, requires two additional Babel dependencies to work
&mdash; `@babel/core` and `babel/preset-react`. And since we’ll be using class decorators for React components, the
`@babel/plugin-proposal-decorators` is also necessary (we’ll explain what decorators do later in the article when we
have a look at the Post module components).

Install the following three dependencies:

```sh
yarn add @babel/core @babel/preset-react @babel/plugin-proposal-decorators --dev
```

You can now install React:

```sh
yarn add react react-dom
```

Finally, to be able to use GraphQL with React, another three dependencies are required &mdash; `apollo-boost`,
`react-apollo`, and `graphql` (you've already installed `graphql` for the server application, so there's no need to
install it again):

```bash
yarn add apollo-boost react-apollo
```

`apollo-boost` is an all-in-one package provided by Apollo to let you build GraphQL queries and mutations on the client.
React needs `react-apollo`, a library that provides custom GraphQL components, in particular, `ApolloProvider`, `Query`,
and `Mutation`. These GraphQL components will be necessary to wrap the React layout components yielding them the data
retrieved from the server by Apollo.

We’re also going to use a UI toolkit Reactstrap to quickly create Bootstrap components with generic styles. Reactstrap
is optional, but you’ll have to manually create the layout for your React application components without it. It's your
call.

Since Reactstrap can't work without Bootstrap, you need to install two dependencies:

```sh
yarn add reactstrap bootstrap
```

That's it. All the dependencies for a React client application are in place. Before we actually start creating a React
application, let’s also add a script to be able to run it:

```json
{
  "scripts": {
    "client": "webpack-dev-server --mode development --open"
  }
}
```

This script will run `webpack-dev-server` in development mode. And once the client build is ready, your default browser
will automatically open the page: notice the `--open` option.

Don’t you try to run the React application _now_ as errors will ensue. You need to first configure webpack for React,
then create React application basic files, and, finally, create a Post module.

### Configuring webpack for React

Create `webpack.config.js` under the project’s root folder and add the code below. There aren't many configurations as
we intentionally keep the webpack configuration minimal:

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
            presets: ['@babel/preset-react'],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [htmlPlugin]
};
```

This webpack configuration is typical for React applications.

Webpack needs the entry to know where the application starts and the `module.rules` property to know how to handle
different files. All the `.js` files will be processed with the `babel-loader` and `@babel/preset-react`. Additionally,
we set the `plugins` property to use `@babel/plugin-proposal-decorators` and `{'legacy': true}`, which are default Babel
settings for decorators. Notice that `HTMLWebpackPlugin` must be passed to the `plugins` array so that webpack knows
what HTML file to load with the build script.

The webpack configuration is done. It’s time to work on our React application.

### Creating basic files for a React application

You can finally move on to building a React application.

Create the `client/src` folder under the root directory of the project if you haven’t done this already. Inside the
`src` folder, create the other two: `config` to store the configurations and `modules` to store the post module.

Next, you need to create the following key files for React:

* `index.html`, a basic HTML template
* `index.js`, the entry point
* `App.js`, the root React component
* `settings/createApolloClient.js`, an instance of Apollo Client with configurations

Let’s create the listed files.

Add the following HTML code into `client/src/index.html`:

```html
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>An Apollo, React, and Express Example Application</title>
  </head>

  <body>
    <div id="root"></div>
  </body>

</html>
```

Note that there's no script tag with the link to the `index.js` file because `HtmlWebpackPlugin` adds it for you.

Next, create the entry point for the application &mdash; the `client/src/index.js` file. Add the following code to
bootstrap the React application:

```javascript
import React from 'react'
import ReactDOM from 'react-dom';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
```

This code is typical for any React application: You import the root `App` component, two required React dependencies,
and Bootstrap. Finally, you render `App` into the `div#root` HTML element (found in `index.html`).

### Creating the main React App component

You might have already created root `App` components for your React applications with the RESTful approach, so you know
what a React’s root component looks like. In this application, however, `App` must be wrapped into another component,
which is provided by `react-apollo` to make it possible to use Apollo Client with React.

Let’s take a look at the code in `App.js`:

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

As you can see, besides the basic React dependencies &mdash; `React` and `Component`, you need to import
`ApolloProvider`, an instance of Apollo Client, and the Post module as `Posts`.

`ApolloProvider` from `react-apollo` is a root component to wrap an entire React application, and it needs an instance
of Apollo Client to work: `<ApolloProvider client={apolloClient}>`. An Apollo Client instance will tell the application
how to query the server.

Now we need to create an Apollo Client instance.

### Initializing Apollo Client

Create a directory `config` under `client/src`, then add `createApolloClient.js` with the following code into `config`:

```javascript
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql'
});

export default client;
```

There’s nothing special going on in this file. First, you import the `ApolloClient` constructor from `apollo-boost`.
Then, when instantiating an Apollo client, you need to pass an object parameter with Apollo settings. For this
application, only the URL is necessary so that Apollo knows where to send queries. (You may run the Express application
and see the logged line `Server is running on http://localhost:3000/graphql`, the same URL.)

## Creating a React module

Under the `client/src/modules` folder, create a new directory `post` to keep the post module. Next, create another four
sub-directories under `post`: `components`, `containers`, `providers`, and `styles`. Finally, add `index.js` with the
following code under `post`:

```javascript
export { default as Posts } from './containers';
```

As you can see, `client/src/modules/post/index.js` imports all the code from `./containers`. Create an `index.js` under
`client/src/modules/post/containers` and copypaste the code below into it:

```javascript
import React, { Component } from 'react'

import { withPosts } from '../providers';
import { PostList, PostForm } from '../components';

import { Container, Row, Col } from 'reactstrap';
import '../styles/styles.css';

/**
 * Wrap Posts component using the withPosts provider
 * to get data retrieved with GraphQL.
 */
@withPosts
export default class PostRoot extends Component {
  render() {
    const { posts, postsLoading } = this.props;

    return (
      <Container>
        <h2 className="posts-title">Posts Module</h2>
            <hr />
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
```

Let’s clarify how this code works.

`post/containers/index.js` provides a root React component for the post module and is called `PostRoot`. Besides
importing `React` and `Component`, we also imported the main provider `withPosts` (which we show later). `withPosts`
wraps `PostRoot` and provides the posts received from the server into the `PostList` component.

Note the syntax: before the class definition goes `@withPosts` as a _decorator_, and for this exact functionality you
installed `@babel/plugin-proposal-decorators`.

Instead of using a decorator, you’d have to write code like this:

```js
//…
class PostRoot extends Component { //… }

export default withPosts(PostRoot);
```

As you can see, using decorators is a bit shorter and more concise than writing `withPosts(PostsRoot)`.

Let’s now discuss the layout in this container. As you noticed, we imported `Container`, `Row`, and `Col` components
from Reactstrap. Each Reactstrap component is an HTML layout with default Bootstrap classes. Therefore, the following
two layouts are identical:

```html
<!-- PostsRoot layout built of Reactstrap components -->
<Container>
    <h2 className="posts-title">Post Module</h2>
    <hr />
    <Row>
      <Col>
        <PostList />
      </Col>
      <Col>
        <PostForm />
      </Col>
    </Row>
</Container>

<!-- An identical PostRoot layout built of HTML elements with Bootstrap classes -->
<div className="container">
      <h2 className="posts-title">Post Module</h2>
      <hr />
      <div className="row">
        <div className="col">
          <!-- Custom PostList component -->
        </div>
        <div className="col">
          <!-- Custom PostForm component -->
         </div>
      </div>
</div>
```

Reactstrap makes building React layouts with Bootstrap styles simpler than if you’d write basic HTML with Bootstrap
classes manually.

There’s one more thing to do before you can create providers and components for the post module. For convenience, it’s
best to have `index.js` files under each module folder to exports multiple providers or components.

Create an `index.js` file under `post/providers` and add another `index.js` into `post/components`.

This is what the `post/providers/index.js` file should look like:

```javascript
export { default as withPosts } from './PostList';
export { default as withAddPost } from './AddPost';
```

And this how `post/components/index.js` looks:

```javascript
export { default as PostList } from './PostList';
export { default as PostForm } from './PostForm';
```

Thanks to such exports, you can shorten the import statements in your files. For instance, instead of importing a
specific component with a line `import { withPosts } from '../providers/withPosts';` you can write a simpler line
`import { withPosts } from '../providers';`. This way, you can also import _multiple_ components in a single line.

Now you can focus on creating the application components and providers. First, we talk through creating the Post List
part of the post module, and after that we’ll show Post Form.

### Creating a Post List

The Post List part will be responsible for two things &mdash; retrieving posts from the server and rendering them.
Hence, you need to create two separate React components to handle those two functions.

One component will only render the list; this component will be stored in `post/components/PostList.js`. Another
component is created according to the Higher Order Component (HOC) pattern. An HOC for Post List, stored in
`post/providers/PostList.js`, will use Apollo to query the server and pass posts as props to the dumb component.

#### Creating a `PostList` Higher Order Component

For a recap, HOC is a pattern in React development that lets you reuse the same logic for many components. In simple
terms, an HOC is a React component that does something and then passes the results of calculations as a props object
into a wrapped component that needs those results.

In this application, a `post/providers/PostList` provider will use Apollo to query the server, get posts, and then pass
those posts to the wrapped component `post/components/PostList`.

Add the `PostList.js` file with the following code under `post/providers`:

```javascript
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

export const GET_POSTS = gql`
  {
    posts {
      _id
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

The `withPosts` provider uses the `gql` method from `apollo-boost` and a `Query` wrapper component from `react-apollo`.

Next, a constant `GET_POSTS` is created, and it references a GraphQL query that defines the data that the server
application must return upon each GET request &mdash; a post’s ID, title, and content.

Finally, a `withPosts()` functional React component is created and is then used as a decorator in the `PostRoot`
container. Notice how `withPosts()` accepts a `Component` parameter and then returns another function. This function
accepts the props parameter (it may receive props from the higher React components) and returns a `react-apollo` `Query`
component, which passes a post list, data, and props into `Component` (`PostRoot` is the component to be wrapped by
`Query`).

It should be clear by now that `post/components/PostList` receives the `postsLoading` and `posts` values through
`PostRoot`. In its turn, `PostRoot` gets the data from `withPosts` provider. The flow looks like this:

${img (location: "",
       alt:"React’s Higher Order Component with Container and Component interaction")}

There’s one more thing to explain before we move further: what’s happening in `Query`? In the `Query` wrapper component,
we need to interpolate a function, which looks like this:

```js
{({ loading, data }) => {
    return (<Component postsLoading={loading} posts={data && data.posts} {...props} />);
}}
```

This function accepts an object returned by GraphQL, and this object has two properties: `loading` and `data`. `loading`
is a boolean value, and `data` contains all the information that came upon a GraphQL query. In this application, `data`
will contain an array of posts to be rendered by `Component`. Any other props that the rendering component may use also
should be passed as `{...props}`.

Next, we create a layout component `PostList`.

#### Creating a dumb component for the post list

To render a list of posts, just add `post/components/PostList.js` with the code below to your current project:

```js
import React, { Component } from 'react';
import { Card, CardTitle, CardBody } from 'reactstrap';

export default class PostList extends Component {
  constructor(props) {
    super(props);

    this.showPosts = this.showPosts.bind(this);
  }

  showPosts() {
    const { posts, postsLoading } = this.props;

    if (!postsLoading && posts.length > 0) {
      return posts.map(post => {
        return (
          <Card key={post._id} body outline className="post-card">
            <CardTitle>{post.title}</CardTitle>
            <CardBody>{post.content}</CardBody>
          </Card>
        );
      });
    } else {
      return (
        <div>
          <h3>No posts available</h3>
          <p>Use the form on the right to create a new post.</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="posts-container">
        {this.showPosts()}
      </div>
    );
  }
}
```

As you can see, this is a typical React component. We use Reactstrap components `Card`, `CardTitle`, and `CardBody` to
create a layout for each post. The `showPosts()` method first verifies if posts exist, and if they do, it returns a
layout to render posts. If there are no posts, a default layout is returned.

The Post List part is created. But it doesn’t show anything, se we’re going to create a mutation and a post form to grab
post data and send it to the server. And once a post gets back from the server, Post List will render it.

### Creating a post form

To be able to create posts with GraphQL mutations, an HTML form is necessary. Similarly to how you created the Post
List part of the application, add another two files: `post/providers/AddPost.js` and `post/components/PostForm.js`.

The layout component, `PostForm.js`, will only render a form and submit it with post title and content, while the
`AddPost` provider will use a GraphQL mutation to send posts to the backend.

#### Creating a Higher Order Component for post form

`AddPost` is also an HOC just like `post/providers/PostList`, and it also uses a `react-apollo` wrapper component,
although this time the necessary wrapper is `Mutation`, not `Query`. To create a GraphQL mutation, you also need the
`gql` method from `apollo-boost`.

Here’s the entire code for `AddPost`:

```javascript
import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

import { GET_POSTS } from './PostsList';

const ADD_POST = gql`
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

Similarly to the `PostList` HOC, you need to create a GraphQL mutation, which is `ADD_POST`. This mutation gets two
values &mdash; `title` and `content` &mdash; and sends an `addPost` mutation query to the backend.

Now let’s take a look at the `withAddPost()` functional React component. It returns a `Mutation` wrapper component,
which accepts the `ADD_POST` mutation to be able to send mutation queries.

Let’s also have a closer look at the `Mutation` contents:

```js
{addPost => {
  return (
    <Component addPost={({ title, content }) => addPost({
      variables: { title, content }, refetchQueries: [
        { query: GET_POSTS }
      ] })}
    />
  )
}}
```

The interpolated function inside `Mutation` accepts just one argument, the `addPost` mutation, and returns `Component`,
`PostForm` in our application.

Also notice that `Component` gets an `addPost` prop function, which will be called in `PostForm` with two parameters
&mdash; `title` and `content`, the form data you'll submit.

Inside the component's `addPost()` method there's a call of the `addPost()` mutation passed to the mutation function.
You can see the following object:

```js
{
  variables: { title, content },
  refetchQueries: [{ query: GET_POSTS }]
}
```

The object with `variables` and `refetchQueries` properties is used by GraphQL to handle mutation queries.

First, we just pass the values that must be stored in the database into the `variables` property. Once those values are
stored to the database, we want the server to respond to the client with the created object. If you just send an
`addPost` mutation query with post data, you won’t see a new post shown in the list because you’ll have to manually
refresh the page. This is when `refetchQueries` is helpful. `refetchQueries` is an array of query objects that we want
to resend. And we want to resend only one query &mdash; `GET_POSTS`.

Finally, let’s create a form to get post data.

#### Creating a PostForm component

Add the file `PostForm.js` with the following code into `post/components`:

```javascript
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
            <Input type="text" name="title" id="postTitle" placeholder="Title" />
          </FormGroup>
          <FormGroup>
            <Label for="postContent">Post Content</Label>
            <Input type="textarea" name="content" id="postContent" placeholder="Content" />
          </FormGroup>
          <Button className="submit-button">Submit new post</Button>
        </Form>
      </div>
    )
  }
}
```

`PostForm` is a typical React component. It has the `submitForm()` method to submit post data using the `addPost()`
method (which it received as a prop from the `AddPost` provider component). The form layout is also typical: We use
Reactstrap components `Form`, `FormGroup`, `Label`, `Input`, and `Button` to create the an HTML form with Bootstrap.

The React application is almost done. We suggest adding some styles and a script to run both server and client
applications with one command.

___

Let’s recap what you’ve created so far:

* A modular React application
* An instance of Apollo Client to handle GraphQL in React
* A Post module consisting of Post List and Post Form
* Providers and components for each module part
* A mutation and query created with Apollo’s gql method

## The finishing touches

You may want to run the React and Express applications simultaneously with just one command. That’s easy to achieve:
install the package called `concurrently` that will let you run two scripts at the same time.

Add `concurrently` to the development dependencies in your `package.json`:

```bash
yarn add concurrently --dev
```

Now, add another script into the `package.json` to run the client and server applications at the same time:

```json
{
  "scripts": {
    "server": "nodemon ./server/server.js",
    "client": "webpack-dev-server --mode development --open",
    "dev": "concurrently \"yarn client\" \"yarn server\""
  }
}
```

Your React, Express, and Apollo application is ready and you can run it with the following command:

```bash
yarn dev
```

To make the client application look better, add the following code to the `client/src/modules/post/styles/styles.css`
file:

```css
.container {
  margin-top: 25px;
  padding: 25px 15px;
  background-color: #f5f7f9;
}

.card-body {
  margin-bottom: 20px;
}

.post-card {
  width: 350px;
  margin: 7px auto;
  cursor: pointer;
  color: #880a8e;
  box-shadow: 1px 2px 3px rgba(136,10,142,0.3);
}

.post-form {
  padding: 25px 20px;
  border: 1px solid rgba(0,0,0,0.125);
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(136,10,142,0.3);
}

.post-card:hover, .post-form:hover {
  box-shadow: 2px 3px 4px rgba(136,10,142,0.5);
}

.submit-button {
  background-color: #880a8e !important;
}
```

The application should be re-built and re-run, and you can open the browser with it. Add a post and see how it’s
rendered to the list:

${img (location: "",
       alt:"Working React application with Apollo GraphQL")}