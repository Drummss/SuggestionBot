const Sequelize = require('sequelize');

const sequelize = new Sequelize('suggestionbot', 'root', '', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'suggestionbot.sqlite',
});

const Watch = require('./models/Watch')(sequelize, Sequelize.DataTypes);

module.exports = { Watch }