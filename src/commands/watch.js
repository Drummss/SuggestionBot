const Discord = require('discord.js');
const Util = require('../util');
const { Watch } = require('../databaseObjects');

module.exports = {
    name: 'watch',
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

        if(checkWatch == 0) {
            Watch.upsert({guild_id: message.guild.id, channel_id: channel.id});
            message.channel.send(`I'm now reacting to <#${channel.id}>!`);
        } else {
            message.channel.send(`I'm already watching <#${channel.id}>.`);
        }
    }
}