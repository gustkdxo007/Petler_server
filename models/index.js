import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import Sequelize from "sequelize";

const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = sequelize.import(join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 1 대 1 (hasOne, belongsTo)
// 1 대 다(hasMany, belongsTo)
// 다 대 다 (belongsToMany)

// user : channel = n : m
db.user.belongsToMany(db.channel, {
  through: db.user_channel,
  foreignKey: { name: "user_id", allowNull: false },
});
// getChannels, setChannels, addChannel, addCehannels 메서드 추가됨
db.channel.belongsToMany(db.user, {
  through: db.user_channel,
  foreignKey: { name: "channel_id", allowNull: false },
});
// getUsers, setUsers, addUser, addUsers 메서드 추가됨

// uesr_channel : todo = n : m (할당 관계)
db.user_channel.belongsToMany(db.todo, {
  through: db.user_channel_todo,
  foreignKey: { name: "user_channel_id", allowNull: false },
});
db.todo.belongsToMany(db.user_channel, {
  through: db.user_channel_todo,
  foreignKey: { name: "todo_id", allowNull: false },
});

// user_channel : todo = 1 : n (작성 관계)
db.user_channel.hasMany(db.todo, { as: "author_id" });
db.todo.belongsTo(db.user_channel, {
  foreignKey: { name: "user_channel_id", allowNull: false },
});

// user_channel : gallery = 1 : n
db.user_channel.hasMany(db.gallery); // getGallerys, setGallerys 메서드 추가됨
db.gallery.belongsTo(db.user_channel, {
  foreignKey: { name: "user_channel_id", allowNull: false },
});

// channel : pet = 1 : n
db.channel.hasMany(db.pet);
db.pet.belongsTo(db.channel, {
  foreignKey: { name: "channel_id", allowNull: false },
  onDelete: "CASCADE",
});
// channel : todo = 1 : n
db.channel.hasMany(db.todo);
db.todo.belongsTo(db.channel, {
  foreignKey: { name: "channel_id", allowNull: false },
  onDelete: "CASCADE",
});

// pet : todo = 1 : n
db.pet.hasMany(db.todo);
db.todo.belongsTo(db.pet, {
  foreignKey: { name: "pet_id", allowNull: false },
  onDelete: "CASCADE",
});

export default db;
