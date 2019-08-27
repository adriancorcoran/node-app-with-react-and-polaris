// DB Connect
const Sequelize = require('sequelize');
const env = require('dotenv').load();


if (process.env.NODE_ENV == "development") {
  // Local database
  module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });
} else {
  // Cloud database
  let credentials = '';
  let matchArray = '';

  credentials = process.env.DATABASE_URL;
  const dbRegex = /\w+:\/\/(\w+)\@([^\/:]+):(\d+)\/([^?]+)?/
  matchArray = dbRegex.exec(credentials);

  module.exports = new Sequelize(matchArray[4], matchArray[1], null, {
    host: matchArray[2],
    port: matchArray[3],
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });
}
