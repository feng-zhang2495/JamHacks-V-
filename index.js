const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();


const dotenv = require('dotenv');
dotenv.config();
const violaters = [];

const { prefix, swearWords, motivational } = require('./config.json');

client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

var recordChannel, recordList, recordNums;

client.on('message', message => {
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
		if (stuffer.includes(swearWords[i])) {
			message.delete();
			message.reply('Explicit language is not tolerated in our server.');
            /*
            if (violaters.includes(message.author.id)) {
                message.author.id.kick();
            } else {
                violaters.push(message.author.id);
            
                break;
        	}*/
		}
	}
    console.log(message.content);



    //If the message doesn't start with prefix it exits 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    
    //commands 
    if (command === "motivation") {       
        message.channel.send(motivational[Math.floor(Math.random() * 20)]);
    
    }
    if (command === "memes") {       
        message.channel.send(memery[Math.floor(Math.random() * 20)]);
    
    } 
    if (command == "setchannel") {
		recordChannel = client.channels.cache.get(message.channel.id);
		recordChannel.send('Channel set!');
	}
	if (command == "showrecords") {
		try {
			recordChannel.send('Should show records');
		} catch {
			message.reply('Channel has not been set or has been deleted!');
		}
	}

    /*if (command === "kick") {
        const userKicked = message.mentions.members.first();
        userKicked.kick();
        message.channel.send(`You kicked: ${taggedUser.username}`)
    }*/

});


client.login(process.env.TOKEN);