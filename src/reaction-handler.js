const Discord = require('discord.js');
const embedcolors = require('./JSONS/embedcolors.json');

module.exports = async (client, reaction, user) => {

    if(user.bot) return;

    reaction.users.remove(user.id);

    reaction.message.guild.members.fetch(user.id).then(prm => {
        var uservoiceChannel = prm.guild.voiceStates.cache.get(user.id).channelID
        var botvoiceChannel = reaction.message.guild.voice.channelID

        if(uservoiceChannel != botvoiceChannel){
            const errorreaction = new Discord.MessageEmbed()
                .setTitle('Reaction Error')
                .setColor(embedcolors.stopped)
                .setDescription(`You need to be in the same Voice Channel to Control the Music!`)
                .setTimestamp();
        
            return user.send(errorreaction)
                .then(async msg => {
                    await msg.delete( {timeout: 5 * 1000} );
                });
        }
    
        if(reaction.emoji.name === '⏯'){
            client.Lavamusic.get('pauseresume').run(user, reaction);
        }
        if(reaction.emoji.name === '⏩'){
            client.Lavamusic.get('skip').run(user, reaction);
        }
        if(reaction.emoji.name === '⏹'){
            client.Lavamusic.get('stop').run(user, reaction);
        }
    })

    // var message;

    // if(reaction.emoji.name === '⏸'){
    //     client.musiccommands.get('pause').run(message, true, user, reaction);
    // }
    // if(reaction.emoji.name === '▶'){
    //     client.musiccommands.get('resume').run(message, true, user, reaction);
    // }
    // if(reaction.emoji.name === '⏩'){
    //     client.musiccommands.get('skip').run(message, true, user, reaction);
    // }
    // if(reaction.emoji.name === '⏹'){
    //     client.musiccommands.get('stop').run(message, true, user, reaction);
    // }
    // if(reaction.emoji.name === '🔊'){
    //     client.musiccommands.get('volumeup').run(message, true, user, reaction);
    // }
    // if(reaction.emoji.name === '🔈'){
    //     client.musiccommands.get('volumedown').run(message, true, user, reaction);
    // }

    return undefined;
}