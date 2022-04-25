const { MessageEmbed } = require("discord.js");
const embedcolors = require('../../JSONS/embedcolors.json');

module.exports = {
    name: 'pauseresume',
    description: 'Pause/Resume LAVA Command for Music'
}

module.exports.run = async function(user, reaction){

    const musicembed = user.client.musicembed.get(reaction.message.guild.id);
    const player = user.client.music.players.get(reaction.message.guild.id);

    const channel = reaction.message.member.voice.channelID;
    if (!channel) return reaction.message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

    if(!player) return reaction.message.channel.send("**No song/s currently playing for this server!**")
        .then(nothingplaying => {
            nothingplaying.delete( {timeout: 3 * 1000} )
        });

    player.pause(player.playing)
    if(player.playing){
        return musicembed.textchannel.messages.fetch({around: musicembed.embedID, limit: 1})
                .then(async msg => {
                    const fetchedMsg = msg.first();
                    const editEmbed = new MessageEmbed()
                        .setTitle('NOW PLAYING 🎧')
                        .setColor(embedcolors.currentlyPlaying)
                        .setDescription(`[${musicembed.tracktitle}](${musicembed.trackurl})`)
                        .setThumbnail(musicembed.thumbnail)
                        //.setFooter(`Queued Songs:`)
                        .setTimestamp();
                    fetchedMsg.edit(editEmbed);
                });
    }
    return musicembed.textchannel.messages.fetch({around: musicembed.embedID, limit: 1})
                .then(async msg => {
                    const fetchedMsg = msg.first();
                    const editEmbed = new MessageEmbed()
                    .setTitle('PAUSED! ⏸')
                    .setDescription('Click ⏯ to resume the songs!')
                    .setColor(embedcolors.paused)
                    .setTimestamp();
                    fetchedMsg.edit(editEmbed);
                });
}