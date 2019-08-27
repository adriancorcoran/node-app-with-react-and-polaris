const Sequelize = require('sequelize');
const db = require('../database');

var Attendee = db.define('attendee', {

  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  workday_id: {
    type: Sequelize.INTEGER,
    notEmpty: true
  },

  checked_in: {
    type: Sequelize.BOOLEAN,
    notEmpty: true
  },

  user_id: {
    type: Sequelize.INTEGER,
    notEmpty: true
  },

  name: {
    type: Sequelize.STRING,
    notEmpty: true
  },

  dietary_requirements: {
    type: Sequelize.STRING,
    notEmpty: true
  },

  slack_id: {
    type: Sequelize.STRING,
    notEmpty: true
  }

});

module.exports = Attendee;
