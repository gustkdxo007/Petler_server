const gallery = (sequelize, DataTypes) => {
  return sequelize.define(
    "gallery",
    {
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    },
  );
};

export default gallery;
