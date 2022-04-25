//  const clientstruct = require('./src/clientstruct');
//  const client = new clientstruct();
  const config = require('./src/JSONS/config.json');

//  client.on('warn', console.warn);
//  client.on('error', console.error);
//  client.on('disconnect', () => console.log('I just disconnected'));
//  client.on('reconnecting', () => console.log('I am reconnecting...'));

const { Manager } = require('erela.js');
const { Client } = require('discord.js');
const client = new Client();
client.musicembed = new Map();

 client.on('ready', async() =>{

    client.music = new Manager({
        nodes: [
          {
            host: config.host,
            port: config.port,
            password: config.password 
          },
        ],
        send(id, payload) {
          const guild = client.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        },
    })

    client.levels = new Map()
        .set('none', 0.0)
        .set('low', 0.1)
        .set('mid', 0.15)
        .set('high', 0.25);

    console.log('client is ready');
    
    client.music.init(client.user.id);

    const baseFile = 'command-handler.js';
    const commandBase = require(`./${baseFile}`);

    commandBase(client);
})

 client.login(config.token);
