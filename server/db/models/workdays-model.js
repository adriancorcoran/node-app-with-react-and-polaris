const Sequelize = require('sequelize');
const db = require('../database');

var Workday = db.define('workday', {

  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  start: {
    type: Sequelize.DATE,
    notEmpty: true
  },
  end: {
    type: Sequelize.DATE,
    notEmpty: true
  },
  location_name: {
    type: Sequelize.STRING,
    notEmpty: true
  }

});

module.exports = Workday;
