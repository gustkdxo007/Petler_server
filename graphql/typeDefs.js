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
  type Todo {
    id: ID!
    todo: String!
    memo: String!
    pushDate: Date
    endDate: Date
    repeatDay: String!
    isDone: Boolean!
  }
  type Photo {
    id: ID!
    img: String!
    memo: String
  }
  input UserInfo {
    email: String!
    name: String!
    password: String!
    img: String!
  }
  input ChannelInfo {
    name: String!
    img: String!
  }
  input PetInfo {
    id: ID
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
  input TodoInfo {
    todo: String!
    memo: String!
    pushDate: Date
    endDate: String
    repeatDay: String!
  }
  input UpdateTodoInfo {
    id: ID!
    todo: String!
    memo: String!
    pushDate: Date!
    endDate: Date!
    repeatDay: String!
  }
  type Query {
    "user는 email로 찾거나 id로 찾거나 둘 중 하나만 하면 됩니다. 혹시 두개다 입력하게 되면 or 문이 적용되기 때문에 꼭 동일한 유저정보를 넣어야 합니다."
    user(email: String, id: ID): User!
    login(email: String!, password: String!): Token!
    channel(id: ID!): Channel!
    pet(id: ID!): Pet!
    todo(id: ID!): Todo!
    photo(id: ID!): Photo!
  }
  type Mutation {
    signUp(userInfo: UserInfo): User!
    updateUserInfo(id: ID!, name: String!, img: String!): Boolean!
    createChannel(channelInfo: ChannelInfo): Channel!
    updateChannel(id: ID!, name: String!, img: String!): Boolean!
    deleteChannel(id: ID!): Boolean!
    createPet(petInfo: PetInfo!): Pet!
    updatePet(updatePet: PetInfo!): Boolean!
    deletePet(id: ID!): String!
    createTodo(todoInfo: TodoInfo!): Todo!
    updateTodo(updateTodoInfo: UpdateTodoInfo!): Boolean!
    deleteTodo(id: ID!): Boolean!
    isDoneTodo(id: ID!): Boolean!
    createPhoto(img: String!, memo: String): Photo
    updatePhoto(id: ID!, img: String!, memo: String!): Boolean!
    deletePhoto(id: ID!): Boolean!
  }
  scalar Date
`;

export default typeDefs;
