const Discord = require('discord.js');
const Util = require('../util');
const { Watch } = require('../dbContext');

module.exports = {
    name: 'watch',
    usage: '[channel]',
    description: 'Add a channel that I should react to.',
    async execute (client, message, args) {
        const channelId = Util.getChannelIdFromMention(args.shift()) || message.channel.id
        const channel = client.channels.cache.get(channelId);

        if(!channel) {
            return message.channel.send(`I can't find that channel.`);
        }

        const checkWatch = await Watch.count({
            where: {
                guild_id: message.guild.id,
                channel_id: channel.id,
            }
        });
        
        const watchEmbed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');

        if(checkWatch == 0) {
            Watch.upsert({guild_id: message.guild.id, channel_id: channel.id});
            watchEmbed.setDescription(`I'm now reacting to <#${channel.id}>!`);
        } else {
            watchEmbed.setDescription(`I'm already watching <#${channel.id}>.`);
        }

        message.channel.send(watchEmbed);
    }
}