const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();


const dotenv = require('dotenv');
dotenv.config();
const violaters = [];

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

    
    for (var i = 0; i < stuff; i++) {
        console.log(message.author.id)
        console.log(violaters)
		if (stuffer.includes(swearWords[i])) {
			message.delete();
			message.reply('Explicit language is not tolerated in our server.');
            if (violaters.includes(message.author.id)) {
				console.log("Should kick");
                message.author.id.kick();
            } else {
                violaters.push(message.author.id);
                console.log(violaters);
                break;
        	}
		}
	}
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    
    if (command === "feng") {
        message.channel.send('your bad');
    }
    if (command === "motivation") {
        message.channel.send('https://bit.ly/3hZdGLx');
    }

});


client.login(process.env.TOKEN);