const Discord = require('discord.js');

module.exports = {
    name: 'lavahandler',
    description: 'Handles all LAVA music commands accordingly'
}

module.exports.run = async function (client, command, message, args){

    try{
        message.delete({timeout: 5 * 1000});
    }
    catch(e){
        console.log('Delete Message Error');
    }
    if (command == 'play'){
        client.Lavamusic.get(command).run(client, message, args);
    }
    else if(command == 'skip'){
        client.Lavamusic.get('skip-command').run(client, message, args);
    }
    else{

        const errorEmbed = new Discord.MessageEmbed()
            .setTitle('Error')
            .setDescription('You cannot use any other command other than **<prefix>play**')
            .setColor("#f02626")
            .setTimestamp()
        message.author.send(errorEmbed);
    }
}