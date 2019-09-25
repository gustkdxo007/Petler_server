export default (sequelize, DataTypes) => {
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
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};
