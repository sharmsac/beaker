const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
	constructor() {
		
		super();

		this.queue = new Map();
		this.musicembed = new Map();
		this.discord = require('discord.js');
		this.erelaclient = require('erela.js')
        
	}
};