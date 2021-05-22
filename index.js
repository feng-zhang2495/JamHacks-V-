const fs = require('fs');

const Discord = require('discord.js');
var cron = require("cron");
const client = new Discord.Client();

const ytdl = require("ytdl-core");
const queue = new Map();
const dotenv = require('dotenv');
dotenv.config();


const { prefix, swearWords, motivational, memery, phrases } = require('./config.json');

client.commands = new Discord.Collection();


client.once('ready', () => {
	console.log('Ready!');
});


var recordChannel;
var announceChannel;
const recordUsers = [];
const recordNums = [];
const dailyevents = [];

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
    if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}
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
 

    
    if (message.content.includes('?')) {
        if (Math.floor(Math.random() * 20) < 1) {
            message.channel.send(phrases[Math.floor(Math.random() * 7)]);
            return;
        }
    }
    
    const serverQueue = queue.get(message.guild.id);
    
    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;

    }
    
    //function stop() {pass
    //}
    
    async function execute(message, serverQueue) {
        const args = message.content.split(" ");
      
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
          	return message.channel.send(
            	"You need to be in a voice channel to play music!"
          	);
		}
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          	return message.channel.send(
            	"I need the permissions to join and speak in your voice channel!"
          	);
        }
      
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
      
        if (!serverQueue) {
          	const queueContruct = {
            	textChannel: message.channel,
            	voiceChannel: voiceChannel,
            	connection: null,
            	songs: [],
            	volume: 5,
            	playing: true
          	};
      
          	queue.set(message.guild.id, queueContruct);
      
          	queueContruct.songs.push(song);
      
          	try {
            	var connection = await voiceChannel.join();
            	queueContruct.connection = connection;
            	play(message.guild, queueContruct.songs[0]);
          	} catch (err) {
            	console.log(err);
            	queue.delete(message.guild.id);
            	return message.channel.send(err);
          	}
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
      
      	function play(guild, song) {
        	const serverQueue = queue.get(guild.id);
        	if (!song) {
            	serverQueue.voiceChannel.leave();
            	queue.delete(guild.id);
            	return;
        	}
      
        	const dispatcher = serverQueue.connection
            	.play(ytdl(song.url))
            	.on("finish", () => {
            	serverQueue.songs.shift();
            	play(guild, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        	dispatcher.setVolumeLogarithmic(serverQueue.volume / 9.5);
        	serverQueue.textChannel.send(`Start playing: **${song.title}**`);
        }
    
    }
          //we did it bois
    
    

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
	if (command[0] == "time") {
		function testTime() {
			announceChannel.send(command[1]);
			a1.stop();
		}
		let a1 = new cron.CronJob(command[4]+" "+command[3]+" "+command[2]+" * * *", testTime);
		a1.start();
		message.channel.send("Set announcement at "+command[2]+":"+command[3]+":"+command[4]);
	}
    //announcement channel commands
    if (command[0] == 'set') {
        if (command[1] == 'announcement') {
            if (command[2] == "daily") {
                dailyevents.push(command[3]);
            }
        }
    }

    /*if (command === "kick") {
        const userKicked = message.mentions.members.first();
        userKicked.kick();
        message.channel.send(`You kicked: ${taggedUser.username}`)
    }*/

});


client.login(process.env.TOKEN);