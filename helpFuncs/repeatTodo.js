import { Op } from "sequelize";
import moment from "moment";
import models from "../models";

const repeatTodo = async () => {
  const weeks = ["일", "월", "화", "수", "목", "금", "토"];
  const today = weeks[moment().day()];
  // eslint-disable-next-line camelcase
  const end_date = moment().format("YYYY-MM-DD HH:mm:ss");
  const todo = await models.todo.findAll({
    where: { repeat_day: { [Op.like]: `%${today}%` } },
  });
  await models.todo.update(
    { end_date, is_done: false },
    {
      where: { repeat_day: { [Op.like]: `%${today}%` } },
    },
  );
  await todo.filter(async (item) => {
    await models.user_channel_todo.update(
      {
        complete_date: null,
      },
      {
        where: { todo_id: item.dataValues.id },
      },
    );
  });
};

export default repeatTodo;
