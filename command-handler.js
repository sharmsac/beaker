const Discord = require('discord.js');
const fs = require('fs');

const { prefix } = require('./src/JSONS/config.json');
const configchannels = require('./src/JSONS/configchannels.json');
const embedcolors = require('./src/JSONS/embedcolors.json');

module.exports = (client) => {

    //Get all js files from Commands/Lavamusic Folder
    client.Lavamusic = new Discord.Collection();
    const LavamusicFiles = fs.readdirSync('./src/commands/Lavamusic/').filter(file => file.endsWith('.js'));
    for(const file of LavamusicFiles){
        const Lavamusic = require(`./src/commands/Lavamusic/${file}`);
        client.Lavamusic.set(Lavamusic.name, Lavamusic);
    }

    //Get all js files from assistCommands Folder
    client.assistcommand = new Discord.Collection();
    const assistCommandFiles = fs.readdirSync('./src/assistCommands/').filter(file => file.endsWith('.js'));
    for(const file of assistCommandFiles){
        const assistcommand = require(`./src/assistCommands/${file}`);
        client.assistcommand.set(assistcommand.name, assistcommand);
    }

    //Get all js files from Lavamusic/musicEvents Folder
    client.musicevents = new Discord.Collection();
    const musiceventFiles = fs.readdirSync('./src/commands/Lavamusic/musicevents').filter(file => file.endsWith('.js'));
    for(const file of musiceventFiles){
        const musicevents = require(`./src/commands/Lavamusic/musicevents/${file}`);
        client.musicevents.set(musicevents.name, musicevents);
    }

    client.on('messageReactionAdd', (reaction, user) => {

        const reactionFile = 'reaction-handler.js';
        const reactionBase = require(`./src/${reactionFile}`);
    
        reactionBase(client, reaction, user);
    });

    client.music
        .on("nodeConnect", node => {
            client.musicevents.get('nodeConnect').run(client, node);
        })
        .on("nodeError", (node, error) => {
            client.musicevents.get('nodeError').run(client, node, error);
        })
        .on("trackStart", (player, track) => {
            client.musicevents.get('trackStart').run(client, player, track);
        })
        .on("queueEnd", player => {
            client.musicevents.get('queueEnd').run(client, player);
        });
        
    client.on("raw", (d) => client.music.updateVoiceState(d));

    client.on('message', async(message) => {

        if(message.author.bot) return;

        //If the command is executed in the Bot's DM
        if (message.channel.type == 'dm') 
        return message.author.send("**Use Server for Commands!**");

        //Make sure command is started with the required Prefix
        if(!message.content.startsWith(prefix)){
            //run autodelete assist command
            client.assistcommand.get('autodeleteChan').execute(message, configchannels);
            return;
        }

        //Splice the message to figure out the command
        const args = message.content.slice(prefix.length).split(/ +/);
        var command = args.shift().toLowerCase();


        //**********************************************
        //Check which command to execute (COMMANDS START HERE)
        //**********************************************

        if(command == 'none'){
        }
        else if(command == 'play' || command == 'skip'){
            client.Lavamusic.get('lavahandler').run(client, command, message, args);
        }
        else{
            message.delete({timeout: 5 * 1000});

            message.author.send({
                embed: {
                    title: "Error",
                    description: `There is no such command: **${prefix}${command}**!`,
                    color: embedcolors.errorColor,
                    footer: { text: "Requested by " + message.author.tag, icon_url: message.author.displayAvatarURL },
                    timestamp: new Date()
                }
            });
        }
    })
}