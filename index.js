const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();


const dotenv = require('dotenv');
dotenv.config();


const { prefix, swearWords, motivational, memery } = require('./config.json');

client.commands = new Discord.Collection();


client.once('ready', () => {
	console.log('Ready!');
});


var recordChannel;
var announceChannel;
const recordUsers = [];
const recordNums = [];

client.on('message', message => {
    //if the message is from the bot exit
    if (message.author.bot) return;
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
			swearingUser = message.author.username
			message.delete();
			message.reply('Explicit language is not tolerated in our server.');
            if (!recordUsers.includes(swearingUser)) {
                recordUsers.push(swearingUser);
				recordNums.push(0);
        	}
			recordNums[recordUsers.indexOf(swearingUser)]++;
			break;
		}
	}
    console.log(message.content);



    //If the message doesn't start with prefix it exits 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.map(x => x.toLowerCase());
    /*if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}*/

    //commands 
    if (command == "motivation") {       
        message.channel.send(motivational[Math.floor(Math.random() * 25)]);
    
    }
    if (command == "memes") {       
        message.channel.send(memery[Math.floor(Math.random() * 20)]);
    
    } 
    //channel setters
	if (command[0] == "set") {
		if (command[1] == "records") {
			recordChannel = client.channels.cache.get(message.channel.id);
			recordChannel.send('Record Channel set!');
        } else if(command[1] == "announcements") {
            announceChannel = client.channels.cache.get(message.channel.id);
			announceChannel.send('Announcements Channel set!');
        }
	}
    /*if (command == "set") {
		recordChannel = client.channels.cache.get(message.channel.id);
		recordChannel.send('Channel set!');
	}*/
    //record channel commands
	if (command == "records") {
		try {
			recordChannel.send("RECORDLIST");
			for(var i = 0; i < recordUsers.length; i++) {
				recordChannel.send(recordUsers[i]+", "+recordNums[i]);
			}
		} catch {
			message.channel.send('Channel has not been set or has been deleted!');
		}
	}
    //time commands
	if (command == "time") {
		message.channel.send(Date());
		var date = Date().split(" ");
		var time = date[4];
		message.channel.send(Date());
	}
    //announcement channel commands
    /*if (command[0] == 'set') {
        if (command[1] == 'announcement') {

        }
    }*/

    /*if (command === "kick") {
        const userKicked = message.mentions.members.first();
        userKicked.kick();
        message.channel.send(`You kicked: ${taggedUser.username}`)
    }*/

});


client.login(process.env.TOKEN);