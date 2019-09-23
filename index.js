const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = 4000;

const Users = [
  {
    id: '1',
    name: 'kim',
    age: 34,
    email: 'hi@gql.com',
  },
  {
    id: '2',
    name: 'Lee',
    age: 24,
    email: 'h45@gql.com',
  },
];
const typeDefs = gql`
  type Users {
    id: String!
    name: String!
    age: Int!
    email: String!
  }
  type Query {
    users: [Users]!
    user(name: String!): Users
  }
  type Mutation {
    addUser(name: String!, age: Int!, email: String!): Users
    deleteUser(name: String!): Users
  }
`;
const resolvers = {
  Query: {
    users: () => Users,
    user: (_, args) => {
      const result = Users.filter((item) => item.name === args.name);
      return result[0];
    },
  },
  Mutation: {
    addUser: (_, args) => {
      const add = {
        id: `${Users.length + 1}`,
        name: args.name,
        age: args.age,
        email: args.email,
      };
      Users.push(add);
      return add;
    },
    deleteUser: (_, args) => {
      const result = Users.filter((user) => user.name === args.name);
      Users.splice(Users.indexOf(result), 1);
      return result[0];
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
