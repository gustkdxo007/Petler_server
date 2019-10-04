const todo = (sequelize, DataTypes) => {
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
        allowNull: true,
      },
      repeat_day: {
        type: DataTypes.STRING, // 배열지원안함. 문자열로 다뤄야 할 듯.
        allowNull: true,
      },
      is_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};

export default todo;
