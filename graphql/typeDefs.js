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
    "user는 email로 찾거나 id로 찾거나 둘 중 하나만 하면 됩니다. 혹시 두개다 입력하게 되면 or 문이 적용되기 때문에 꼭 동일한 유저정보를 넣어야 합니다."
    user(email: String, id: ID): User!
    users: [User]!
    login(email: String!, password: String!): Token!
  }
  type Mutation {
    signUp(signupInput: SignupInput): User
  }
`;

export default typeDefs;
