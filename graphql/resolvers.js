const Users = [
  {
    id: "1",
    name: "kim",
    age: 34,
    email: "hi@gql.com",
  },
  {
    id: "2",
    name: "Lee",
    age: 24,
    email: "h45@gql.com",
  },
];

const resolvers = {
  Query: {
    users: () => {
      return Users;
    },
    user: (_, args) => {
      const result = Users.filter((item) => {
        return item.name === args.name;
      });
      return result[0];
    },
  },
  Mutation: {},
};

export default resolvers;
