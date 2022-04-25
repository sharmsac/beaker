const Discord = require('discord.js');
const embedcolors = require('../../../JSONS/embedcolors.json');

module.exports = {
    name: 'nodeError',
    description: 'nodeError Event for ErelaClient'
}

module.exports.run = async function(client, node , error){

    console.log(`Node error: ${error.message}`);
    
}
