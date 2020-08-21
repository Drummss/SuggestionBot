const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');
const { prefix, token } = require('./config/settings.json');
const { Watch } = require('./src/databaseObjects');

const client = new Discord.Client();
client.prefix = prefix;
client.commands = new Discord.Collection();

/*
    Recursively add commands.
*/
const addCommands = function(dirPath, commandList) {
    fs.readdirSync(dirPath).forEach(function (file) {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
            addCommands(`${dirPath}/${file}`, commandList);
        } else {
            const command = require(`${dirPath}/${file}`);
            commandList.set(command.name, command);
            try {
                command.alias.forEach(function (alias) {
                    commandList.set(alias, command);
                });
            }
            catch (error) {

            }
        }
    });

    console.log(`Commands loaded from '${dirPath}' (${commandList.map(x => x.name).join(', ')}).`);
};

/*
    Setup commands.
    TODO: Add modules.
*/
addCommands('./src/commands', client.commands)

client.once('ready', () => {
    console.log('Suggestion Bot has successfully started.'.blue);

    client.user.setActivity("your awesome ideas!", { type: "WATCHING" })
});

/*
    Add reaction to messages.
*/
client.on('message', async message => {
    if(message.content.startsWith(prefix) || message.author.bot) return;
    if(message.channel.type == 'dm') return;

    if(await Watch.findOne({
        where: {
            guild_id: message.guild.id, 
            channel_id: message.channel.id
        }
    }) == null) return;

    await message.react('746110774090661960'); // Checkmark
    await message.react('746110773872296077'); // Cross
});

/*
    Listen for commands.
*/
client.on('message', (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    if(message.channel.type == 'dm') return;
    
    if(!message.member.hasPermission(['MANAGE_CHANNELS'])) {
        message.reply('you need `Manage Channel` permissions to use this bot.');
        return;
    }
    
    const args = message.content.slice(client.prefix.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    try {
        command.execute(client, message, args);
    }
    catch(error) { 
        console.log(error);
        message.channel.send('There was an error executing that command.');
        return;
    }
});

client.login(token);