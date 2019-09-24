export default (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "기본사진이 들어가야 합니다",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("now()"),
      },
    },
    {
      timestamps: false,
      underscored: true,
    },
  );
};
