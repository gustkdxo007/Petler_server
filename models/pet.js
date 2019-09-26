const pet = (sequelize, DataTypes) => {
  return sequelize.define(
    "pet",
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      type_detail: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      intro: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      back_color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      back_img: {
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

export default pet;
