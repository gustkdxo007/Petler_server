export default (sequelize, DataTypes) => {
  return sequelize.define(
    "user_channel",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      set_alarm: {
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
