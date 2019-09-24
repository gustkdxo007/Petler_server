export default (sequelize, DataTypes) => {
  return sequelize.define(
    "todo",
    {
      todo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      push_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      repeat_day: {
        type: DataTypes.BOOLEAN, // 다시 보세요
        allowNull: true,
      },
      channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};
