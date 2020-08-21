const Discord = require('discord.js');
const Util = require('../util');
const { Watch } = require('../databaseObjects');

module.exports = {
    name: 'list',
    usage: '',
    description: `A list of the channels I'm currently reacting to.`,
    async execute (client, message, args) {
        const watches = await Watch.findAll({
            where: {
                guild_id: message.guild.id,
            }
        });
        
        const listEmbed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');

        if(watches.length > 0) {
            listEmbed.addField(`I'm reacting to these channels`, watches.map(x => `<#${x.channel_id}>`).join("\n"));
        } else {
            listEmbed.setDescription(`I'm currently not reacting to anything :(`);
        }

        message.channel.send(listEmbed);
    }
}