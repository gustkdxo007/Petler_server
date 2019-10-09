import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    img: String!
    channels(id: ID): [Channel!]!
  }
  type Channel {
    id: ID!
    name: String!
    img: String
    users(id: ID): [User!]!
    pets(id: ID): [Pet!]!
    todos(id: ID): [Todo!]!
    checkUser(email: String!): Boolean!
    setAlarm: Boolean!
    user_channel_id: ID!
  }
  type Token {
    token: String!
    user: User!
    channel: [Channel!]!
  }
  type Pet {
    id: ID!
    name: String!
    gender: String
    age: String
    type: String
    type_detail: String
    intro: String
    img: String!
    todo_color: String!
    card_cover: String
    todos(id: ID): [Todo!]!
  }
  type Todo {
    id: ID!
    todo: String!
    memo: String
    push_date: Date
    end_date: Date
    repeat_day: String
    is_done: Boolean!
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
  "create할때는 channelID를 꼭 입력해주시고, update 할때는 todoId를 꼭 입력해주세요"
  input TodoInfo {
    token: String!
    todoId: ID
    todo: String!
    memo: String
    pushDate: Date
    endDate: Date
    repeatDay: String
    petId: ID!
    channelId: ID
    assignedId: ID!
  }
  type Query {
    "user는 email로 찾거나 id로 찾거나 둘 중 하나만 하면 됩니다. 혹시 두개다 입력하게 되면 or 문이 적용되기 때문에 꼭 동일한 유저정보를 넣어야 합니다."
    user(token: String!): User!
    login(email: String!, password: String!): Token!
    channel(id: ID!): Channel!
    pet(id: ID!): Pet!
    getUserByToken(token: String!): User!
    todo(id: ID!): Todo!
    photo(id: ID!): Photo!
    confirmPW(token: String!, password: String!): Boolean!
    checkEmail(email: String!): String
    checkUser(email: String!): Boolean!
    setAlarm(id: ID): Boolean!
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
    updateTodo(updateTodoInfo: TodoInfo!): Boolean!
    deleteTodo(token: String!, id: ID!): Boolean!
    isDoneTodo(token: String!, id: ID!): Boolean!
    createPhoto(img: String!, memo: String): Photo
    updatePhoto(id: ID!, img: String!, memo: String!): Boolean!
    deletePhoto(id: ID!): Boolean!
    updateAlarm(token: String!, channelId: ID!): Boolean!
    addUserToChannel(token: String!, email: String!, channelId: ID!): String!
    updatePassword(token: String!, password: String!): Boolean!
    dismissUser(token: String!, dismissId: ID!, channelId: ID!): Boolean!
  }
  type Subscription {
    todo(channelId: ID!): TodoSubscription!
  }
  type TodoSubscription {
    mutation: String!
    channelId: ID!
  }
  scalar Date
`;

export default typeDefs;
