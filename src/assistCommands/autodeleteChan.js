const Discord = require('discord.js');

module.exports = {
    name: 'autodeleteChan',
    description: 'Auto Deletes Messages from Chosen Channels Automatically if Set',
    execute(message, configchannels){

        if(message.channel.id == configchannels.validateChan) {
            if(JSON.parse(configchannels.validateautodel)){
                setTimeout(function() {
                    message.delete();
                }, 3000)            
            }
        }
        if(message.channel.id == configchannels.paidChan) {
            if(JSON.parse(configchannels.paidautodel)){
                setTimeout(function() {
                    message.delete();
                }, 3000)            
            }
        }
        if(message.channel.id == configchannels.freeChan) {
            if(JSON.parse(configchannels.freeautodel)){
                setTimeout(function() {
                    message.delete();
                }, 3000)            
            }
        }
    }
}