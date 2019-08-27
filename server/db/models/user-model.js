const Sequelize = require('sequelize');
const db = require('../database');

// Create the User table
var User = db.define('user', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  googleID: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  displayName: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  givenName: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  familyName: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  avatar: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  email: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  slack_id: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  admin_level: {
    type: Sequelize.INTEGER,
    notEmpty: true,
    default: 0
  },
  locations: {
    type: Sequelize.STRING
  },
  dietary_requirements: {
    type: Sequelize.STRING
  }
});

module.exports = User;
