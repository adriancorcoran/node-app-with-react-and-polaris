const Sequelize = require('sequelize');
const db = require('../database');

var Location = db.define('location', {

  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    notEmpty: true
  },

  address: {
    type: Sequelize.STRING,
    notEmpty: true
  }

});

module.exports = Location;
