const Discord = require('discord.js');
const Util = require('../util');
const { Guild } = require('../dbContext');

module.exports = {
    name: 'prefix',
    usage: '[prefix]',
    description: `Change my prefix.`,
    async execute (client, message, args) {        
        const embed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');

        const newPrefix = args.shift();
        const guild = await Guild.findOne({
            where: {
                guild_id: message.guild.id
            }
        });

        if(newPrefix) {
            if(newPrefix === "unset") {
                Guild.update({
                    prefix: null
                }, {
                    where: {
                        guild_id: guild.guild_id,
                    }
                });

                embed.setDescription('Custom prefix has been unset.');
            } else {
                Guild.update({
                    prefix: newPrefix
                }, {
                    where: {
                        guild_id: guild.guild_id,
                    }
                });

                embed.setDescription(`I will now respond to the custom prefix \`${newPrefix}\`.`);
            }
        } else {
            if(guild.prefix != 0) {
                embed.setDescription(`I currently respond to the custom prefix \`${guild.prefix}\`.`);
            } else {
                embed.setDescription(`I don't have a custom prefix yet.`);
            }
        }

        message.channel.send(embed);
    }
}