const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();


const dotenv = require('dotenv');
dotenv.config();


const { prefix, swearWords } = require('./config.json');

client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
    //If the message doesn't start with prefix it exits 

	// private dms people
    /*
	const user = client.users.cache.get(message.author.id);
	user.send("hi");
	*/
    //find channel and send to specific channel
	/*
	const channel = client.channels.cache.get(message.author.id);
	channel.send('content');
	*/

    const stuff = swearWords.length;
    const stuffer = message.content.split(' ');
    const violaters = [];

    
    for (var i = 0; i < stuff; i++) {
		if (stuffer.includes(swearWords[i])) {
			message.delete();
			message.reply('Explicit language is not tolerated in our server. Further violations will result in a server kick.');
            if violaters.includes(message.author.id):
                user.kick();
            else:
                violaters.push(message.author.id);
            


            return;
        }
	}
    
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    
    if (command === "feng") {
        message.channel.send('your bad');
    }

});


client.login(process.env.TOKEN);