import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    img: String!
  }

  type Token {
    token: String!
    user: User!
  }

  input SignupInput {
    email: String!
    name: String!
    password: String!
    img: String!
  }
  type Query {
    user: User!
    users: [User]!
    login(email: String!, password: String!): Token!
  }
  type Mutation {
    signUp(signupInput: SignupInput): User
  }
`;

export default typeDefs;
