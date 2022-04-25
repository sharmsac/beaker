const Discord = require('discord.js');
const embedcolors = require('../../../JSONS/embedcolors.json');

module.exports = {
    name: 'trackStart',
    description: 'trackStart Event for ErelaClient'
}

module.exports.run = async function(client, player, track){

    const requester = track.requester.id;
    
    client.channels.fetch(player['textChannel'])
        .then(async channel => {
    
            var oldmusicembed = client.musicembed.get(channel.guild.id);

            if(oldmusicembed){
                oldmusicembed.textchannel.messages.fetch({around: oldmusicembed.embedID, limit: 1})
                    .then(msg => {
                        const fetchedMsg = msg.first();
                        try{
                            fetchedMsg.delete();
                        }
                        catch(e){
                            console.log('Delete Message Error');
                        }
                        client.musicembed.delete(channel.guild.id);
                    });
            }

            const createNewEmbed = new Discord.MessageEmbed()
                .setTitle('NOW PLAYING 🎧')
                .setColor(embedcolors.currentlyPlaying)
                .setDescription(`[${track.title}](${track.uri})`)
                //.setFooter(`Queued Songs:`)
                .setTimestamp();
            
            await channel.send(createNewEmbed)
                .then(async msg => {

                    const musicembedConstruct = {
                        embedID: msg.id,
                        tracktitle: track.title,
                        trackurl: track.uri,
                        textchannel: channel,
                    };
                    client.musicembed.set(channel.guild.id, musicembedConstruct);

                    await msg.react('⏯'),
                    await msg.react('⏩'),
                    await msg.react('⏹')
                })
                .catch(error => {
                    console.log(error)
                })
         })
         .catch(error => {
            console.log(error)
         })
    
}
