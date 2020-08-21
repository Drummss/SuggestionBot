const Discord = require('discord.js');
const { prefix, token } = require('./config/settings.json');
const { Watch } = require('./src/databaseObjects');

const client = new Discord.Client();
client.prefix = prefix;
client.commands = new Discord.Collection();

const newCommand = function(commandName) {
    const command = require(`./src/commands/${commandName}.js`);
    client.commands.set(command.name, command);
}

/*
    Setup commands.
    TODO: Make this automatic.
    TODO: Add modules.
*/
newCommand('watch');
newCommand('stop');

client.once('ready', () => {
    console.log('Suggestion Bot has successfully started.');
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