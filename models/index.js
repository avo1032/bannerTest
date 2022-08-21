const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const User = require('./user');
const Banner = require('./banner');
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Banner = Banner;

User.init(sequelize);
Banner.init(sequelize);

User.associate(db);
Banner.associate(db);

module.exports = db;
