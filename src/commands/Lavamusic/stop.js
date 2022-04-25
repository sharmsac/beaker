const { MessageEmbed } = require("discord.js");
const embedcolors = require('../../JSONS/embedcolors.json');

module.exports = {
    name: 'stop',
    description: 'Stop LAVA Command for Music'
}

module.exports.run = async function(user, reaction){

    const musicembed = user.client.musicembed.get(reaction.message.guild.id);
    const player = user.client.music.players.get(reaction.message.guild.id);

    if(!player) return reaction.message.channel.send("**No song/s currently playing for this server!**")
        .then(nothingplaying => {
            try{
                nothingplaying.delete( {timeout: 3 * 1000} )
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    musicembed.textchannel.messages.fetch({around: musicembed.embedID, limit: 1})
    .then(msg => {
        const fetchedMsg = msg.first();
        const stopped = new MessageEmbed()
            .setTitle('STOPPED! ⏹')
            .setDescription(`**Queue Cleared and Bot Stopped!**`)
            .setColor(embedcolors.stopped)
            .setTimestamp();
        fetchedMsg.edit(stopped)
            .then(stoppedsong => {
                try{
                    stoppedsong.delete( {timeout: 6 * 1000} )
                }
                catch(e){
                    console.log('Delete Message Error');
                }
            });
        user.client.musicembed.delete(reaction.message.guild.id);
    });

    player.destroy()

    return undefined;
}