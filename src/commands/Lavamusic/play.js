const { MessageEmbed } = require("discord.js");
const embedcolors = require('../../JSONS/embedcolors.json');

module.exports = {
    name: 'play',
    description: 'Play LAVA Command for Music'
}

module.exports.run = async function(client, message, args){

    const { channel } = message.member.voice;
    if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!')
        .then(novoicechannel => {
            try{
                novoicechannel.delete({timeout: 5 * 1000})
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!')
        .then(noperms => {
            try{
                noperms.delete({timeout: 5 * 1000})
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });
    if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!')
        .then(noperms => {
            try{
                noperms.delete({timeout: 5 * 1000})
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    var searchArg = args.join(' ');

    if(searchArg == '') return message.channel.send('Search argument was not provided! Enter: **!play <Search>**')
        .then(nosearchargs => {
            try{
                nosearchargs.delete({timeout: 5 * 1000})
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });

    player = client.music.players.get(message.guild.id);

    if(!player){
        player = client.music.create({
            guild: message.guild.id,
            textChannel: message.channel.id,
            voiceChannel: message.member.voice.channel.id
        });
        player.connect()
    }

    client.music.search(searchArg, message.author)
        .then(async result => {
            if(result == null){
                message.channel.send(`The search needs to be more specific than **'${searchArg}'**!`)
            }

            console.log(result)

            switch (result.loadType){
                case "TRACK_LOADED":
                    console.log(result.tracks[0]);
                    player.queue.add(result.tracks[0]);
                    const songAdded = new MessageEmbed()
                        .setTitle('Song Added 🎹')
                        .setColor(embedcolors.songSelection)
                        .setDescription(`**${result.tracks[0].title}**`)
                        .setTimestamp();
                    message.channel.send(songAdded)
                        .then(songAdded => {
                            try{
                                songAdded.delete( {timeout: 5 * 1000});
                            }
                            catch(e){
                                console.log('Delete Message Error');
                            }
                        });
                    if(!player.playing) player.play();
                break;

                case "SEARCH_RESULT":
                    let index = 1;
                    const tracks = result.tracks.slice(0,5);
                    const embed = new MessageEmbed()
                        .setAuthor('Song Selection.', message.author.displayAvatarURL)
                        .setColor(embedcolors.songSelection)
                        .setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
                        .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection!")
                    await message.channel.send(embed)
                        .then(msg => {
                            const collector = message.channel.createMessageCollector(m => {
                                return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                            }, { time: 30 * 1000, max: 1})
        
                            collector.on("collect", async (m) => {
                                try{
                                    m.delete( {timeout: 5 * 1000} );
                                }
                                catch(e){
                                    console.log('Delete Message Error');
                                }
                                
                                if(/cancel/i.test(m.content)) return collector.stop("cancelled");
        
                                const track = tracks[Number(m.content) - 1];
                                player.queue.add(track);
                                const songAdded = new MessageEmbed()
                                    .setTitle('Song Added 🎹')
                                    .setColor(embedcolors.songSelection)
                                    .setDescription(`**${track.title}**`)
                                    .setTimestamp();
                                msg.edit(songAdded)
                                    .then(async songAdded => {
                                        try{
                                            songAdded.delete( {timeout: 5 * 1000} );
                                        }
                                        catch(e){
                                            console.log('Delete Message Error');
                                        }
                                    });
                                if(!player.playing) player.play();
                            })
        
                            collector.on("end", async (_, reason) => {
                                if(["time", "cancelled"].includes(reason)) {
                                    const canceled = new MessageEmbed()
                                        .setTitle('Selection Canceled ❌')
                                        .setColor(embedcolors.songSelection)
                                        .setDescription(`**Selection has been Cancelled**`)
                                        .setTimestamp();
                                    msg.edit(canceled)
                                        .then(canceled => {
                                            try{
                                                canceled.delete( {timeout: 5 * 1000} );
                                            }
                                            catch(e){
                                                console.log('Delete Message Error');
                                            }
                                        });
                                    return undefined;
                                }
                            })
                        });
                break;

                case "PLAYLIST_LOADED":
                    result.tracks.forEach(track => {
                        player.queue.add(track);
                    })
                    const playlistAdded = new MessageEmbed()
                        .setTitle('Playlist Added 🎼')
                        .setColor(embedcolors.songSelection)
                        .setDescription(`**${result.playlist.name}**`)
                        .setTimestamp();
                    message.channel.send(playlistAdded)
                        .then(async playlistAddedm => {
                            try{
                                playlistAddedm.delete( {timeout: 5 * 1000} );
                            }
                            catch(e){
                                console.log('Delete Message Error');
                            }
                        })
                    if(!player.playing) player.play();
                break;
            }
        }).catch(error => {
            message.channel.send(`**'${error}'**!`)
        })

}