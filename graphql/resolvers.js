import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import models from "../models";
import hash from "../auth/hash";

dotenv.config();

const resolvers = {
  Query: {
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
    todo: async (_, args) => {
      const todo = await models.todo.findOne({ where: { id: args.id } });
      if (!todo) {
        throw new Error("일치하는 todo가 없습니다");
      }
      return todo;
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
    createPet: async (_, { petInfo }) => {
      const pet = await models.pet.create({
        name: petInfo.name,
        birth: petInfo.birth,
        gender: petInfo.gender,
        age: petInfo.age,
        type: petInfo.type,
        type_detail: petInfo.typeDetail,
        intro: petInfo.intro,
        img: petInfo.img,
        back_color: petInfo.todoColor,
        back_img: petInfo.cardCover,
      });
      return pet;
    },
    updatePet: async (_, { updatePet }) => {
      if (!updatePet.id) {
        throw new Error("pet ID 를 입력해주세요");
      }
      await models.pet.update(
        {
          name: updatePet.name,
          birth: updatePet.birth,
          gender: updatePet.gender,
          age: updatePet.age,
          type: updatePet.type,
          type_detail: updatePet.typeDetail,
          intro: updatePet.intro,
          img: updatePet.img,
          back_color: updatePet.todoColor,
          back_img: updatePet.cardCover,
        },
        { where: { id: updatePet.id } },
      );
      const pet = await models.pet.findOne({ where: { id: updatePet.id } });
      if (!pet) {
        throw new Error("일치하는 pet이 없습니다");
      }
      if (
        pet.dataValues.name === updatePet.name
        && pet.dataValues.birth === updatePet.birth
        && pet.dataValues.gender === updatePet.gender
        && pet.dataValues.age === updatePet.age
        && pet.dataValues.type === updatePet.type
        && pet.dataValues.type_detail === updatePet.typeDetail
        && pet.dataValues.intro === updatePet.intro
        && pet.dataValues.img === updatePet.img
        && pet.dataValues.back_color === updatePet.todoColor
        && pet.dataValues.back_img === updatePet.cardCover
      ) {
        return true;
      }
      return false;
    },
    deletePet: async (_, { id }) => {
      const pet = await models.pet.findOne({ where: { id } });
      if (!pet) {
        throw new Error("펫이 존재하지 않습니다.");
      }
      const value = await models.pet.destroy({ where: { id } });
      if (!value) {
        throw new Error("삭제가 실패하였습니다.");
      }
      return pet.name;
    },
    createTodo: async (_, { todoInfo }) => {
      const todo = await models.todo.create({
        todo: todoInfo.todo,
        memo: todoInfo.memo,
        push_date: todoInfo.pushDate,
        end_date: todoInfo.endDate,
        repeat_day: todoInfo.repeatDay,
      });
      return todo.dataValues;
    },
    deleteTodo: async (_, { id }) => {
      const todo = await models.todo.findOne({ where: { id } });
      if (!todo) {
        throw new Error("Todo 가 존재하지 않습니다.");
      }
      const value = await models.todo.destroy({ where: { id } });

      if (!value) {
        throw new Error("삭제를 실패하였습니다.");
      }
      return true;
    },
    isDoneTodo: async (_, { id }) => {
      const todo = await models.todo.findOne({ where: { id } });
      if (!todo) {
        throw new Error("해당 todo 가 존재하지 않습니다");
      }
      if (todo.dataValues.is_done === true) {
        throw new Error("완료된 todo 입니다");
      }
      await models.todo.update(
        {
          is_done: true,
        },
        { where: { id } },
      );
      const isTrue = await models.todo.findOne({ where: { id } });
      if (isTrue.is_done === true) {
        return true;
      }
      return false;
    },
  },
};

export default resolvers;
