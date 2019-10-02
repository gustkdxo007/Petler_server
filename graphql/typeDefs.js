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
    img: String
  }
  type Token {
    token: String!
    user: User!
  }
  type Pet {
    id: ID!
    name: String!
    gender: String
    age: String
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
  "create할때는 channelID를 null로 입력해서, update할때는 channelID를 꼭 입력해주세요"
  input ChannelInfo {
    token: String!
    name: String!
    img: String
    channelId: ID
  }
  "create할때는 channelID를 꼭 입력해주시고, update 할때는 petId를 꼭 입력해주세요"
  input PetInfo {
    token: String!
    petId: ID
    name: String!
    gender: String
    age: String
    type: String
    typeDetail: String
    intro: String
    img: String!
    todoColor: String!
    cardCover: String
    channelId: ID
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
    getUserByToken(token: String!): User!
    todo(id: ID!): Todo!
    photo(id: ID!): Photo!
    confirmPW(token: String!, password: String!): Boolean!
  }
  type Mutation {
    signUp(userInfo: UserInfo!): User!
    updateUserInfo(token: String!, name: String!, img: String!): Boolean!
    createChannel(channelInfo: ChannelInfo!): Channel!
    updateChannel(channelInfo: ChannelInfo!): Boolean!
    deleteChannel(token: String!, id: ID!): Boolean!
    createPet(petInfo: PetInfo!): Pet!
    updatePet(updatePet: PetInfo!): Boolean!
    deletePet(token: String!, id: ID!): String!
    createTodo(todoInfo: TodoInfo!): Todo!
    updateTodo(updateTodoInfo: UpdateTodoInfo!): Boolean!
    deleteTodo(id: ID!): Boolean!
    isDoneTodo(id: ID!): Boolean!
    createPhoto(img: String!, memo: String): Photo
    updatePhoto(id: ID!, img: String!, memo: String!): Boolean!
    deletePhoto(id: ID!): Boolean!
    updatePassword(token: String!, password: String!): Boolean!
  }
  scalar Date
`;

export default typeDefs;
