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

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 1 대 1 (hasOne, belongsTo)
// 1 대 다(hasMany, belongsTo)
// 다 대 다 (belongsToMany)

// user : channel = n : m
db.user.belongsToMany(db.channel, { through: db.user_channel, foreignKey: "user_id" });
// getChannels, setChannels, addChannel, addCehannels 메서드 추가됨
db.channel.belongsToMany(db.user, { through: db.user_channel, foreignKey: "channel_id" });
// getUsers, setUsers, addUser, addUsers 메서드 추가됨

// uesr_channel : todo = n : m (할당 관계)
db.user_channel.belongsToMany(db.todo, {
  through: db.user_channel_todo,
  foreignKey: "user_channel_id",
});
db.todo.belongsToMany(db.user_channel, { through: db.user_channel_todo, foreignKey: "todo_id" });

// user_channel : todo = 1 : n (작성 관계)
db.user_channel.hasMany(db.todo, { as: "author_id" });

// user_channel : gallery = 1 : n
db.user_channel.hasMany(db.gallery); // getGallerys, setGallerys 메서드 추가됨

// channel : pet = 1 : n
db.channel.hasMany(db.pet);

// channel : todo = 1 : n
db.channel.hasMany(db.todo);

// pet : todo = 1 : n
db.pet.hasMany(db.todo);

export default db;
