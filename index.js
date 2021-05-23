const fs = require('fs');

const Discord = require('discord.js');
var cron = require("cron");
const client = new Discord.Client();

const ytdl = require("ytdl-core");
const queue = new Map();
const dotenv = require('dotenv');
dotenv.config();


const { prefix, swearWords, motivational, memery, phrases, eightBall } = require('./config.json');

client.commands = new Discord.Collection();


client.on('ready', () => {
	console.log('Ready!');
    client.user.setActivity("Type ?Help to get some help, because you know you need it", {
        type: "STREAMING, LIVE!",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      });
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
    

	

     
 
    //commands
    if (message.content.includes('?')) {
        if (Math.floor(Math.random() * 100) < 1) {
            message.channel.send(phrases[Math.floor(Math.random() * 7)]);
            return;
        }
    }
    

    //MUSIC COMMANDS
    const serverQueue = queue.get(message.guild.id);
    
    if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} 
    
    
    
    //MOTIVATION
    if (command == "motivation") {       
        message.channel.send(motivational[Math.floor(Math.random() * 25)]);
    
    }

    //MEMES
    if (command == "memes") {       
        message.channel.send(memery[Math.floor(Math.random() * 20)]);
    
    } 

    //CHANNEL SETTERS
	if (command[0] == "set") {
		if (command[1] == "records") {
			recordChannel = client.channels.cache.get(message.channel.id);
			recordChannel.send('Record Channel set!');
        } else if(command[1] == "announcements") {
            announceChannel = client.channels.cache.get(message.channel.id);
			announceChannel.send('Announcements Channel set!');
        }
	}
    
    /*
    if (command == "set") {
		recordChannel = client.channels.cache.get(message.channel.id);
		recordChannel.send('Channel set!');
	}*/


    //RECORD CHANNEL EVENTS
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
    
    //TIME COMMANDS
	if (command[0] == "time" || command[0] == "daily") {
		const commander = command.map((x) => x);
        function testTime() {
            for(var q = 0; q < 4; q++) {
				commander.shift();
			}
			announceChannel.send(commander.join(" "));
			a1.stop();
		}
		let a1 = new cron.CronJob(commander[3]+" "+commander[2]+" "+commander[1]+" * * *", testTime);
		a1.start();
		message.channel.send("Announcement set at "+commander[1]+":"+commander[2]+":"+commander[3]);
	}
    
    /*
    if (command[0] == "weekly") {
        const 
    } 
    */
    /*if (command === "kick") {
        const userKicked = message.mentions.members.first();
        userKicked.kick();
        message.channel.send(`You kicked: ${taggedUser.username}`)
    }*/
    
    //8BALL 
    if (command[0] == '8ball') {
        message.react('🎱')
        if (command[1] == undefined) {
            message.reply('What do you want?')
        } else if (command[command.length - 1].includes("?")) {
            message.reply(':8ball: ' + eightBall[Math.floor(Math.random() * 7)]);
        } else { 
        message.reply('Please enter a question');    
        }
    }

    //DATE 
	if (command[0] == "date") {
		message.send(Date());
	}

    //HELP
    if (command[0] == 'help') {
        if (command[1] == undefined) {
            message.channel.send('Commands:\nmotivation, memes, 8ball, play, skip, stop, set records, records, set announcements, time, daily, date\n\nPlease enter "?help <command name>" to get specific details.');
        } else if (command[1] == 'motivation') {
            message.channel.send('Use this command to send motivational pictures')
        }
        else if (command[1] == 'memes') {
            message.channel.send('Use this command to send a wide variety of memes')
        }
        else if (command[1] == '8ball') {
            message.channel.send('Ask a question to the 8ball and get an answer')
        }
        else if (command[1] == 'play') {
            message.channel.send('Enter "?play <youtube-url-here>" while in an voice channel, to play the audio from the video in the Voice Channel')
        }
        else if (command[1] == 'skip') {
            message.channel.send('Skips the current song in the queue.')
        }
        else if (command[1] == 'stop') {
            message.channel.send('Makes the bot leave the voice channel and stop playing music.')
        }
        else if (command[1] == 'set' && command[2] == 'records') {
            message.channel.send('Set a channel for the bot to send its record logs too')
        }
        else if (command[1] == 'records') {
                message.channel.send('Have the bot send the records of users and their warnings to the set records channel')
        }
        else if (command[1] == 'set'  && command[2] == 'announcements') {
            message.channel.send('Sets the announcements channel')
        }
        else if (command[1] == 'time') {
            message.channel.send('Send an announcement to the announcements channel at a certain time, e.g. ?time hour minuite second message, EX. ?time 18 22 00 hello\nThis will print an announcement set at 18 22 00 that says hello')
        }
        else if (command[1] == 'date') {
            message.channel.send('Sends the current date')
        }
    }
});

async function execute(message, serverQueue) {
    const secondArgs = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(secondArgs[1]);
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
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (!serverQueue)
        return message.channel.send("There is no song that I could stop!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
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
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


client.login(process.env.TOKEN);