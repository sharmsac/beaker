const Discord = require('discord.js');
const embedcolors = require('../../../JSONS/embedcolors.json');

module.exports = {
    name: 'queueEnd',
    description: 'queueEnd Event for ErelaClient'
}

module.exports.run = async function(client, player){

    var oldmusicembed = client.musicembed.get(player.guild);  

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
            client.musicembed.delete(player.guild);
        });
    }

    const queueEnd = new Discord.MessageEmbed()
    .setTitle('Queue Empty 🚫')
    .setColor(embedcolors.stopped)
    .setDescription(`There is nothing left in the Queue!`)
    .setTimestamp();
    
    guild = client.guilds.cache.get(player.guild)
    channel = guild.channels.cache.get(player.textChannel)
    channel.send(queueEnd)
        .then(async queueEndmsg => {
            try{
                await queueEndmsg.delete( {timeout: 5 * 1000} );
            }
            catch(e){
                console.log('Delete Message Error');
            }
        });
    player.destroy();
}
