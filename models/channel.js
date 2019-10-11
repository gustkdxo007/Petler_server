const channel = (sequelize, DataTypes) => {
  return sequelize.define(
    "channel",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};

export default channel;
