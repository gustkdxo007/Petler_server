export default (sequelize, DataTypes) => {
  return sequelize.define(
    "user_channel_todo",
    {
      user_channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      todo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      complete_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};
