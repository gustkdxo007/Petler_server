import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    img: String!
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
  }
  type Mutation {
    signUp(signupInput: SignupInput): User
  }
`;

export default typeDefs;
