const { MessageEmbed } = require("discord.js");
const embedcolors = require('../../JSONS/embedcolors.json');

module.exports = {
    name: 'skip-command',
    description: 'Skip LAVA Command for Music'
}

module.exports.run = async function(client, message, args){

    const musicembed = client.musicembed.get(message.guild.id);
    const player = client.music.players.get(message.guild.id);

    if(!player) return message.channel.send("**No song/s currently playing for this server!**")
        .then(nothingplaying => {
            try{
                nothingplaying.delete( {timeout: 3 * 1000} )
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    player.stop();

    const skipped = new MessageEmbed()
        .setTitle('SKIPPED! ⏸')
        .setDescription(`**${musicembed.tracktitle}** was Skipped!`)
        .setColor(embedcolors.skipped)
        .setTimestamp();
    message.channel.send(skipped)
        .then(skippedsong => {
            try{
                skippedsong.delete( {timeout: 5 * 1000} )
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    return undefined;
}