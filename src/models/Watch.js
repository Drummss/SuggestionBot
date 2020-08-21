module.exports = (sequelize, DataTypes) => {
	return sequelize.define('watch', {
		guild_id: {
			type: DataTypes.STRING,
            allowNull: false,
		},
		channel_id: {
			type: DataTypes.STRING,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};