const Discord = require('discord.js');
const Util = require('../util');
const { Watch } = require('../dbContext');

module.exports = {
    name: 'stop',
    usage: '',
    description: `Removes a channel from being reacted to.`,
    async execute (client, message, args) {
        const channelId = Util.getChannelIdFromMention(args.shift()) || message.channel.id
        const channel = client.channels.cache.get(channelId);

        if(!channel) {
            message.channel.send(`I can't find that channel.`);
        }

        const checkWatch = await Watch.count({
            where: {
                guild_id: message.guild.id,
                channel_id: channel.id,
            }
        });
        
        const stopEmbed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');

        if(checkWatch > 0) {
            Watch.destroy({
                where: {
                    guild_id: message.guild.id, 
                    channel_id: channel.id,
                }
            });
            stopEmbed.setDescription(`I'm no longer reacting to <#${channel.id}>!`);
        } else {
            stopEmbed.setDescription(`I haven't been watching <#${channel.id}>.`);
        }

        message.channel.send(stopEmbed);
    }
}