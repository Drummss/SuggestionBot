const Sequelize = require('sequelize');

const sequelize = new Sequelize('suggestionbot', 'root', '', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'suggestionbot.sqlite',
});

const Guild = require('./models/Guild')(sequelize, Sequelize.DataTypes);
const Watch = require('./models/Watch')(sequelize, Sequelize.DataTypes);

sequelize.sync();