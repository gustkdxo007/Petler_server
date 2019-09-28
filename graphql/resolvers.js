import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import models from "../models";
import hash from "../auth/hash";

dotenv.config();

const resolvers = {
  Query: {
    users: async () => {
      const users = await models.user.findAll();
      return users;
    },
    user: async (_, { email = "null", id = "null" }) => {
      const user = await models.user.findOne({
        where: {
          [Op.or]: [{ email }, { id }],
        },
      });
      return user;
    },
    channel: async (_, args) => {
      const channel = await models.channel.findOne({
        where: { id: args.id },
      });
      return channel;
    },
    channels: async () => {
      const channels = await models.channel.findAll();
      return channels;
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
    pet: async (_, { id }) => {
      const pet = await models.pet.findOne({
        where: { id },
      });
      if (!pet) {
        throw new Error("찾는 pet이 없습니다.");
      }
      return pet;
    },
  },
  Mutation: {
    signUp: async (_, args) => {
      const signed = await models.user.findOne({
        where: { email: args.userInfo.email },
      });
      if (signed) {
        throw new Error("이미 가입된 사용자입니다.");
      }
      const newUser = models.user.create({
        name: args.userInfo.name,
        email: args.userInfo.email,
        password: hash(args.userInfo.password),
        img: args.userInfo.img,
      });
      return newUser;
    },
    updateUserInfo: async (_, { id, name, img }) => {
      await models.user.update({ name, img }, { where: { id } });
      const user = await models.user.findOne({ where: { id } });
      if (user.dataValues.name === name && user.dataValues.img === img) {
        return true;
      }
      return false;
    },
    createChannel: async (_, args) => {
      const newChannel = await models.channel.create({
        img: args.channelInfo.img,
        name: args.channelInfo.name,
      });
      return newChannel;
    },
    updateChannel: async (_, args) => {
      await models.channel.update(
        {
          img: args.img,
          name: args.name,
        },
        { where: { id: args.id } },
      );
      const updateChannel = await models.channel.findOne({
        where: { id: args.id },
      });

      if (updateChannel.dataValues.name !== args.name) return false;
      if (updateChannel.dataValues.img !== args.img) return false;
      return true;
    },

    deleteChannel: async (_, args) => {
      const result = await models.channel.destroy({ where: { id: args.id } });
      return !!result;
    },
  },
};

export default resolvers;
