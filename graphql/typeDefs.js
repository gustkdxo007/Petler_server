import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    img: String!
  }
  type Channel {
    id: ID!
    name: String!
    img: String!
  }
  type Token {
    token: String!
    user: User!
  }
  type Pet {
    id: ID!
    name: String!
    birth: String
    gender: String
    age: Int
    type: String
    typeDetail: String
    intro: String
    img: String
    todoColor: String!
    cardCover: String
  }
  input userInfo {
    email: String!
    name: String!
    password: String!
    img: String!
  }
  input channelInfo {
    name: String!
    img: String!
  }
  type Query {
    "user는 email로 찾거나 id로 찾거나 둘 중 하나만 하면 됩니다. 혹시 두개다 입력하게 되면 or 문이 적용되기 때문에 꼭 동일한 유저정보를 넣어야 합니다."
    user(email: String, id: ID): User!
    users: [User]!
    login(email: String!, password: String!): Token!
    channel(id: ID!): Channel!
    channels: [Channel]!
    pet(id: ID!): Pet!
  }
  type Mutation {
    signUp(userInfo: userInfo): User!
    updateUserInfo(id: ID!, name: String!, img: String!): Boolean!
    createChannel(channelInfo: channelInfo): Channel!
    updateChannel(id: ID!, name: String!, img: String!): Boolean!
    deleteChannel(id: ID!): Boolean!
  }
`;

export default typeDefs;
