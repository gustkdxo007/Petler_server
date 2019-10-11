/* eslint-disable camelcase */
const user_channel = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_channel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      set_alarm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};

export default user_channel;
