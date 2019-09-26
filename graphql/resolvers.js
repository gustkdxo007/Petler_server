/* eslint-disable no-unused-expressions */
import dotenv from "dotenv";
import models from "../models";
import hash from "../auth/hash";

dotenv.config();

const resolvers = {
  Query: {
    users: () => {
      // models.user
      //   .findAll()
      //   .then((result) => {
      //     console.log(result);
      //     return result.json();
      //   })
      //   .catch((err) => {
      //     return console.log(err);
      //   });
    },
    user: (_, args) => {
      const result = Users.filter((item) => {
        return item.name === args.name;
      });
      return result[0];
    },
  },
  Mutation: {
    signUp: async (_, args) => {
      const a = await models.user.findOne({
        where: { email: args.signupInput.email },
      });
      if (a) {
        console.log("이미 가입된 사용자입니다.");
        return null;
      }
      const newUser = models.user.create({
        name: args.signupInput.name,
        email: args.signupInput.email,
        password: hash(args.signupInput.password),
        img: args.signupInput.img,
      });
      return newUser;
    },
  },
};

export default resolvers;
