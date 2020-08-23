const Discord = require('discord.js');
const Util = require('../util');

module.exports = {
    name: 'help',
    usage: '',
    description: 'Shows this help embed.',
    async execute (client, message, args) {        
        const embed = new Discord.MessageEmbed()
            .setColor('#4444ff')
            .setTitle('Suggestion Bot');
            
        client.commands.forEach(command => {
            const usageString = `${client.prefix + command.name} ${command.usage}`;

            embed.addField(
                Util.capitalizeString(command.name),
                `\`${usageString.trim()}\`\n${command.description}`,
                true
            );
        });

        if(client.commands.size % 3 === 2) embed.addField('\u200b', '\u200b', true);

        message.channel.send(embed);
    }
}