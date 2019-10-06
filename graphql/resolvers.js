import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import models from "../models";
import hash from "../auth/hash";

dotenv.config();

const resolvers = {
  Query: {
    user: async (_, { token }) => {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await models.user.findOne({
        where: { email: decoded.email },
      });
      return user;
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
      const channel = await user.getChannels().map((item) => {
        return item.dataValues;
      });
      return { token, user, channel };
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
    photo: async (_, args) => {
      const photo = await models.gallery.findOne({ where: { id: args.id } });
      if (!photo) {
        throw new Error("일치하는 photo가 없습니다");
      }
      return photo;
    },
    confirmPW: async (_, { token, password }) => {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await models.user.findOne({
        where: { email: decoded.email },
      });
      const valid = hash(password);
      return valid === user.dataValues.password;
    },
  },
  User: {
    channels: async (user, { id }) => {
      const channels = await user.getChannels();
      if (id) {
        return channels.filter((c) => {
          return `${c.dataValues.id}` === id;
        });
      }
      return channels;
    },
  },
  Channel: {
    users: async (channel, { id }) => {
      const users = await channel.getUsers();
      if (id) {
        return users.filter((c) => {
          return `${c.dataValues.id}` === id;
        });
      }
      return users;
    },
    pets: async (channel, { id }) => {
      const pets = await channel.getPets();
      console.log("PETS", pets);
      if (id) {
        return pets.filter((c) => {
          return `${c.dataValues.id}` === id;
        });
      }
      return pets;
    },
    todos: async (channel, { id }) => {
      const todos = await channel.getTodos();
      if (id) {
        return todos.filter((c) => {
          return `${c.dataValues.id}` === id;
        });
      }
      return todos;
    },
  },
  Pet: {
    todos: async (pet, { id }) => {
      const todos = await pet.getTodos();
      if (id) {
        return todos.filter((c) => {
          return `${c.dataValues.id}` === id;
        });
      }
      return todos;
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
      const { dataValues } = await models.user.findOne({
        where: { email: decoded.email },
      });
      await models.user.update({ name, img }, { where: { id: dataValues.id } });
      const user = await models.user.findOne({ where: { id: dataValues.id } });
      if (user.dataValues.name === name && user.dataValues.img === img) {
        return true;
      }
      return false;
    },
    createChannel: async (_, { channelInfo }) => {
      const decoded = await jwt.verify(channelInfo.token, process.env.JWT_SECRET);
      const { dataValues } = await models.user.findOne({
        where: { email: decoded.email },
      });
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
      if (!petInfo.channel_id) {
        throw new Error("channel ID 를 입력해주세요");
      }
      await jwt.verify(petInfo.token, process.env.JWT_SECRET);
      const pet = await models.pet.create({
        name: petInfo.name,
        gender: petInfo.gender,
        age: petInfo.age,
        type: petInfo.type,
        type_detail: petInfo.type_detail,
        intro: petInfo.intro,
        img: petInfo.img,
        channel_id: petInfo.channel_id,
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
          todo_color: updatePet.todo_color,
          card_cover: updatePet.card_cover,
        },
        { where: { id: updatePet.petId } },
      );
      const { dataValues } = await models.pet.findOne({
        where: { id: updatePet.petId },
      });
      if (
        dataValues.name === updatePet.name
        && dataValues.gender === updatePet.gender
        && dataValues.age === updatePet.age
        && dataValues.type === updatePet.type
        && dataValues.type_detail === updatePet.type_detail
        && dataValues.intro === updatePet.intro
        && dataValues.img === updatePet.img
        && dataValues.todo_color === updatePet.todo_color
        && dataValues.card_cover === updatePet.card_cover
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
      if (!todoInfo.channel_id) throw new Error("channel ID 를 입력해주세요");
      const { email } = await jwt.verify(todoInfo.token, process.env.JWT_SECRET);
      const user = await models.user.findOne({ where: { email } });
      const channelByUser = await user.getChannels().filter((item) => {
        return `${item.dataValues.id}` === todoInfo.channel_id;
      });
      const channelIdByUser = channelByUser[0].dataValues.user_channel.dataValues.id;
      const todo = await models.todo.create({
        todo: todoInfo.todo,
        memo: todoInfo.memo,
        push_date: todoInfo.push_date,
        end_date: todoInfo.end_date,
        repeat_day: todoInfo.repeat_day,
        pet_id: todoInfo.pet_id,
        channel_id: todoInfo.channel_id,
        user_channel_id: channelIdByUser,
      });

      todoInfo.assigned_id.split(",").forEach((item) => {
        todo.addUser_channel(item);
      });
      // user_channel에 존재하지 않은 값이 들어가면 서버에서는 오류를 띄우는데 투두 테이블에는 추가가 된다. 그걸 막고 싶은데 방법이 없을까?
      return todo;
    },
    updateTodo: async (_, { updateTodoInfo }) => {
      if (!updateTodoInfo.todo_id) throw new Error("Todo ID 를 입력해주세요");
      await jwt.verify(updateTodoInfo.token, process.env.JWT_SECRET);
      await models.todo.update(
        {
          todo: updateTodoInfo.todo,
          memo: updateTodoInfo.memo,
          push_date: updateTodoInfo.push_date,
          end_date: updateTodoInfo.end_date,
          repeat_day: updateTodoInfo.repeat_day,
          pet_id: updateTodoInfo.pet_id,
        },
        { where: { id: updateTodoInfo.todo_id } },
      );
      const todo = await models.todo.findOne({
        where: { id: updateTodoInfo.todo_id },
      });
      const assinged = await todo.getUser_channels().map((item) => {
        return item.dataValues.id;
      });
      if (assinged.join() !== updateTodoInfo.assigned_id) {
        await models.user_channel_todo.destroy({
          where: { todo_id: updateTodoInfo.todo_id },
        });
        updateTodoInfo.assigned_id.split(",").forEach((item) => {
          todo.addUser_channel(item);
        });
      }
      console.log("%%", updateTodoInfo.memo);
      if (
        todo.dataValues.todo === updateTodoInfo.todo
        && todo.dataValues.memo === updateTodoInfo.memo
        // todo.dataValues.push_date === updateTodoInfo.pushDate &&
        // todo.dataValues.end_date === updateTodoInfo.endDate &&
        && todo.dataValues.repeat_day === updateTodoInfo.repeat_day
      ) {
        return true;
      }
      return false;
    },
    deleteTodo: async (_, { token, id }) => {
      await jwt.verify(token, process.env.JWT_SECRET);
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
    isDoneTodo: async (_, { token, id }) => {
      const { email } = await jwt.verify(token, process.env.JWT_SECRET);
      const { dataValues } = await models.user.findOne({ where: { email } });

      const todo = await models.todo.findOne({ where: { id } });
      if (!todo) {
        throw new Error("해당 todo 가 존재하지 않습니다");
      }
      await models.todo.update(
        {
          is_done: !todo.is_done,
        },
        { where: { id } },
      );
      const userChannelByTodo = await todo.getUser_channels().filter((item) => {
        return item.dataValues.user_id === dataValues.id;
      });
      const isTrue = await models.todo.findOne({ where: { id } });
      if (userChannelByTodo.length === 0) {
        await models.user_channel_todo.update({ complete_date: null }, { where: { todo_id: id } });
        const userChannelId = await models.user_channel.findOne({
          where: { user_id: dataValues.id, channel_id: isTrue.channelId },
        });
        await todo.addUser_channel(userChannelId.dataValues.id, {
          through: { complete_date: isTrue.is_done ? new Date() : null },
        });
      } else {
        await models.user_channel_todo.update({ complete_date: null }, { where: { todo_id: id } });
        const userChannelTodoId = userChannelByTodo[0].dataValues.user_channel_todo.dataValues.id;
        await models.user_channel_todo.update(
          { complete_date: isTrue.is_done ? new Date() : null },
          { where: { id: userChannelTodoId } },
        );
      }
      return isTrue.is_done;
    },
    addUserToChannel: async (_, { token, channelId }) => {
      const { email } = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await models.user.findOne({ where: { email } });
      await user.addChannel(channelId);
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
    updatePassword: async (_, { token, password }) => {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      await models.user.update(
        {
          password: hash(password),
        },
        { where: { email: decoded.email } },
      );
      const { dataValues } = await models.user.findOne({
        where: { email: decoded.email },
      });
      return hash(password) === dataValues.password;
    },
  },
};

export default resolvers;
