import dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
    login: async (_, { email, password }) => {
      const user = await models.user.findOne({
        where: { email },
      });
      if (!user) {
        throw new Error("가입되지 않은 아이디입니다");
      }
      const valid = hash(password);
      if (valid !== user.dataValues.password) {
        throw new Error("비밀번호가 일치하지 않습니다");
      }
      const token = jwt.sign({ email, valid }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return { token, user };
    },
  },
  Mutation: {
    signUp: async (_, args) => {
      const signed = await models.user.findOne({
        where: { email: args.signupInput.email },
      });
      if (signed) {
        throw new Error("이미 가입된 사용자입니다.");
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
