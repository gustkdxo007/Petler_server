import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    name: String!
    email: String!
    password: String!
    img: String!
  }
  input SignupInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }
  type Query {
    user: User!
    users: [User]!
  }
  type Mutation {
    signup(signupInput: SignupInput): User!
  }
`;

export default typeDefs;
