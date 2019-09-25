export default (sequelize, DataTypes) => {
  return sequelize.define(
    "user_channel_todo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
