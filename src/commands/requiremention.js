const Discord = require('discord.js');
const Util = require('../util');
const { Guild } = require('../dbContext');

module.exports = {
    name: 'requiremention',
    usage: '',
    description: `I will only react to suggestions I'm mentioned in.`,
    async execute (client, message, args) {
        const guild = await Guild.findOne({
            where: {
                guild_id: message.guild.id
            }
        });
        
        const embed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');

        if(guild) {
            if(!guild.require_mention) {
                embed.setDescription(`I will only react to suggestions I'm mentioned in now!`);
                embed.setFooter(`Typing this command again revert the changes.`);
            } else {
                embed.setDescription(`I will react to **any** suggestion in channels that I'm watching!`);
            }

            Guild.update({require_mention: !guild.require_mention}, {
                where: {
                    guild_id: guild.guild_id,
                }
            });
        }

        message.channel.send(embed);
    }
}