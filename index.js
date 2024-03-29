require('dotenv').config();

const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');
const { Guild, Watch } = require('./src/dbContext');

const client = new Discord.Client();
client.prefix = process.env.PREFIX ?? 'sb.';
client.commands = new Discord.Collection();

/*
    Features
    TODO: Allow server owners to toggle between user messages being reacted to and the 

    Database
    TODO: Add database migrations.
    TODO: Add support for non-sqlite configuration.
*/

/*
    Recursively adds commands.
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

/* 
    Register Guilds 
*/
const registerGuilds = async function() {
    const connectedGuilds = client.guilds.cache.array();
    let newGuilds = 0;

    for (let i = 0; i < connectedGuilds.length; i++) {
        const guild = connectedGuilds[i];
        const checkGuild = await Guild.findOne({
            where: {
                guild_id: guild.id
            }
        });

        if(!checkGuild) {
            await Guild.upsert({guild_id: guild.id});
            newGuilds += 1;
        }
    }

    if(newGuilds > 0) console.log('[SuggestionBot]'.green, `${newGuilds} new guild${newGuilds == 1 ? 's':''} registered.`);
}

client.once('ready', () => {
    console.log('[SuggestionBot]'.green, 'Successfully started.');

    registerGuilds();

    console.log('[SuggestionBot]'.green, `Connected to ${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's':''}.`);

    client.user.setActivity('your awesome ideas!', { type: "WATCHING" })
});

/*
    Register new guilds when created.
*/
client.on('guildCreate', async guild => {
    await Guild.upsert({guild_id: guild.id});
    console.log('[SuggestionBot]'.green, `New guild registered.`);
});

const getPrefix = async function(message) {
    const guild = await Guild.findOne({
        where: {
            guild_id: message.guild.id
        }
    });

    if(message.content.startsWith(client.prefix)) 
        return client.prefix;
    else if((guild.prefix != 0 && guild.prefix != null) && message.content.startsWith(guild.prefix))
        return guild.prefix;

    return null;
}

/*
    Add reaction to messages.
*/
client.on('message', async message => {
    if(message.channel.type == 'dm' || message.author.bot) return;
    if(message.content.startsWith("> ") || message.content.startsWith(">>> ")) return;
    if(await getPrefix(message)) return;

    if(await Watch.findOne({
        where: {
            guild_id: message.guild.id, 
            channel_id: message.channel.id
        }
    }) == null) return;

    const requiresMention = await Guild.count({
        where: {
            guild_id: message.guild.id,
            require_mention: true
        }
    });

    if(requiresMention && !message.mentions.has(client.user)) return;

    await message.react('746110774090661960'); // Checkmark
    await message.react('746110773872296077'); // Cross
});

/*
    Listen for commands.
*/
client.on('message', async (message) => {
    if(message.channel.type == 'dm' || message.author.bot) return;

    const prefixUsed = await getPrefix(message);
    if(!prefixUsed) return;
    
    if(!message.member.hasPermission(['MANAGE_CHANNELS'])) {
        message.reply('you need `Manage Channel` permissions to use this bot.');
        return;
    }
    
    const args = message.content.slice(prefixUsed.length).split(/\s+/);
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

const token = process.env.TOKEN;

if(!token) {
    console.error('error:'.red, 'A token must be defined in the environment');
    process.exit(1);
}

client.login(token);