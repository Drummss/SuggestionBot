module.exports = (sequelize, DataTypes) => {
    return sequelize.define('guild', {
        guild_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: false,
            allowNull: true
        },
        require_mention: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};