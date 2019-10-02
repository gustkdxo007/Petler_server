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
      if (!user) {
        throw new Error("일치하는 사용자가 없습니다. ");
      }
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
      const token = jwt.sign({ email, valid }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
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
    getUserByToken: async (_, { token }) => {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded.exp < Date.now().splite(-3));
      // console.log(decoded.exp);
      // console.log(Date.now());
      // if (decoded.exp < Date.now() / 1000) {
      //   throw new Error("token 만료 기간이 지났습니다.");
      // }
      const user = await models.user.findOne({
        where: { email: decoded.email },
      });
      if (!user) {
        throw new Error("일치하는 유저 정보가 없습니다");
      }
      return user;
    todo: async (_, args) => {
      const todo = await models.todo.findOne({ where: { id: args.id } });
      if (!todo) {
        throw new Error("일치하는 todo가 없습니다");
      }
      return todo;
    },
    photo: async (_, args) => {
      const photo = await models.gallery.findOne({ where: { id: args.id } });
      if (!photo) {
        throw new Error("일치하는 photo가 없습니다");
      }
      return photo;
    },
  },
  Mutation: {
    signUp: async (_, { userInfo }) => {
      const signed = await models.user.findOne({
        where: { email: userInfo.email },
      });
      if (signed) {
        throw new Error("이미 가입된 사용자입니다.");
      }
      const newUser = models.user.create({
        name: userInfo.name,
        email: userInfo.email,
        password: hash(userInfo.password),
        img: userInfo.img,
      });
      return newUser;
    },
    updateUserInfo: async (_, { token, name, img }) => {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const { dataValues } = await models.user.findOne({ where: { email: decoded.email } });
      await models.user.update({ name, img }, { where: { id: dataValues.id } });
      const user = await models.user.findOne({ where: { id: dataValues.id } });
      if (user.dataValues.name === name && user.dataValues.img === img) {
        return true;
      }
      return false;
    },
    createChannel: async (_, { channelInfo }) => {
      const decoded = await jwt.verify(channelInfo.token, process.env.JWT_SECRET);
      const { dataValues } = await models.user.findOne({ where: { email: decoded.email } });
      const newChannel = await models.channel.create({
        img: channelInfo.img,
        name: channelInfo.name,
      });
      newChannel.addUser(dataValues.id);
      return newChannel;
    },
    updateChannel: async (_, { channelInfo }) => {
      if (!channelInfo.id) {
        throw new Error("channel ID 를 입력해주세요.");
      }
      await jwt.verify(channelInfo.token, process.env.JWT_SECRET);
      await models.channel.update(
        {
          img: channelInfo.img,
          name: channelInfo.name,
        },
        { where: { id: channelInfo.id } },
      );
      const { dataValues } = await models.channel.findOne({
        where: { id: channelInfo.id },
      });

      if (dataValues.name !== channelInfo.name) return false;
      if (dataValues.img !== channelInfo.img) return false;
      return true;
    },
    deleteChannel: async (_, { token, id }) => {
      await jwt.verify(token, process.env.JWT_SECRET);
      const result = await models.channel.destroy({ where: { id } });
      return !!result;
    },
    createPet: async (_, { petInfo }) => {
      if (!petInfo.channelId) {
        throw new Error("channel ID 를 입력해주세요");
      }
      await jwt.verify(petInfo.token, process.env.JWT_SECRET);
      const pet = await models.pet.create({
        name: petInfo.name,
        gender: petInfo.gender,
        age: petInfo.age,
        type: petInfo.type,
        type_detail: petInfo.typeDetail,
        intro: petInfo.intro,
        img: petInfo.img,
        todo_color: petInfo.todoColor,
        card_cover: petInfo.cardCover,
        channel_id: petInfo.channelId,
      });
      return pet;
    },
    updatePet: async (_, { updatePet }) => {
      if (!updatePet.petId) {
        throw new Error("pet ID 를 입력해주세요");
      }
      await jwt.verify(updatePet.token, process.env.JWT_SECRET);
      await models.pet.update(
        {
          name: updatePet.name,
          gender: updatePet.gender,
          age: updatePet.age,
          type: updatePet.type,
          type_detail: updatePet.typeDetail,
          intro: updatePet.intro,
          img: updatePet.img,
          todo_color: updatePet.todoColor,
          card_cover: updatePet.cardCover,
        },
        { where: { id: updatePet.petId } },
      );
      const { dataValues } = await models.pet.findOne({ where: { id: updatePet.petId } });
      if (
        dataValues.name === updatePet.name
        && dataValues.gender === updatePet.gender
        && dataValues.age === updatePet.age
        && dataValues.type === updatePet.type
        && dataValues.type_detail === updatePet.typeDetail
        && dataValues.intro === updatePet.intro
        && dataValues.img === updatePet.img
        && dataValues.todo_color === updatePet.todoColor
        && dataValues.card_cover === updatePet.cardCover
      ) {
        return true;
      }
      return false;
    },
    deletePet: async (_, { token, id }) => {
      await jwt.verify(token, process.env.JWT_SECRET);
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
    updateTodo: async (_, { updateTodoInfo }) => {
      if (!updateTodoInfo.id) {
        throw new Error("Todo ID 를 입력해주세요");
      }
      await models.todo.update(
        {
          todo: updateTodoInfo.todo,
          memo: updateTodoInfo.memo,
          push_date: updateTodoInfo.pushDate,
          end_date: updateTodoInfo.endDate,
          repeat_day: updateTodoInfo.repeatDay,
        },
        { where: { id: updateTodoInfo.id } },
      );
      const todo = await models.todo.findOne({
        where: { id: updateTodoInfo.id },
      });
      if (
        todo.dataValues.todo === updateTodoInfo.todo &&
        todo.dataValues.memo === updateTodoInfo.memo &&
        // todo.dataValues.push_date === updateTodoInfo.pushDate &&
        // todo.dataValues.endDate === updateTodoInfo.endDate &&
        todo.dataValues.repeat_day === updateTodoInfo.repeatDay
      ) {
        return true;
      }
      return false;
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
    createPhoto: async (_, { img, memo }) => {
      const photo = await models.gallery.create({ img, memo });
      return photo;
    },
    updatePhoto: async (_, { id, img, memo }) => {
      await models.gallery.update(
        {
          img,
          memo,
        },
        { where: { id } },
      );
      const { dataValues } = await models.gallery.findOne({
        where: { id },
      });
      if (dataValues.img === img && dataValues.memo === memo) return true;
      return false;
    },
    deletePhoto: async (_, { id }) => {
      const photo = await models.gallery.findOne({ where: { id } });
      if (!photo) {
        throw new Error("해당 photo 가 존재하지 않습니다.");
      }
      const value = await models.gallery.destroy({ where: { id } });
      if (!value) {
        throw new Error("삭제를 실패하였습니다.");
      }
      return true;
    },
  },
};

export default resolvers;

// get method
// const user = await models.user.findOne({ where: { email: decoded.email } });
//       const a = await user.getChannels().map(item => {
//         return item.dataValues.id;
//       })
