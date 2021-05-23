const fs = require('fs');

const Discord = require('discord.js');
var cron = require("cron");
const client = new Discord.Client();

const ytdl = require("ytdl-core");
const queue = new Map();
const dotenv = require('dotenv');
dotenv.config();
const yts = require( 'yt-search' )

const { prefix, swearWords, motivational, memery, phrases, eightBall } = require('./config.json');

client.commands = new Discord.Collection();


client.on('ready', () => {
	console.log('Ready!');
    client.user.setActivity(`Type ${prefix}Help to get bot functions`);
});


var recordChannel;
var announceChannel;
var dayOfWeek;
var msg;
var polling = false;
const recordUsers = [];
const recordNums = [];
const dailyevents = [];
const voters = [0, 0, 0, 0];
const alreadyPolled = [];

client.on('message', message => {
    //if the message is from the bot exit
    if (message.author.bot) return;
    const stuff = swearWords.length;
    

    for (var i = 0; i < stuff; i++) {
        const stuffer = message.content.split(' ');
		if (stuffer.includes(swearWords[i])) {
			swearingUser = message.author.username
			message.delete();
			message.reply('Explicit language is not tolerated in this server.');
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
    if (message.content.includes(`${prefix}`)) {
        if (Math.floor(Math.random() * 100) < 1) {
            message.channel.send(phrases[Math.floor(Math.random() * 6)]);
            return;
        }
    }
    
    
    //MUSIC COMMANDS
    nicetry: try{
    var serverQueue = queue.get(message.guild.id);
    }
    catch{
        break nicetry;
    }
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
    else if (command == "motivation") {       
        message.channel.send(motivational[Math.floor(Math.random() * 25)]);
    }


    //MEMES
    else if (command == "memes") {       
        message.channel.send(memery[Math.floor(Math.random() * 20)]);
    } 


    //CHANNEL SETTERS
	else if (command[0] == "set") {
		if (command[1] == "records") {
			recordChannel = client.channels.cache.get(message.channel.id);
			recordChannel.send('Record Channel set!');
        } else if(command[1] == "announcements") {
            announceChannel = client.channels.cache.get(message.channel.id);
			announceChannel.send('Announcements Channel set!');
        }
	}


    //RECORD CHANNEL EVENTS
	else if (command == "records") {
		try {
			recordChannel.send("Swear word wall of shame:");
			for(var i = 0; i < recordUsers.length; i++) {
				recordChannel.send(recordUsers[i]+", "+recordNums[i]);
			}
		} catch {
			message.channel.send('Records channel has not been set or has been deleted!');
		}
	}
    
    //ANNOUNCE
    testAnnounce: if (command[0] == "announce") {
        if (announceChannel == undefined) {
            message.channel.send(`You must specify an announcements channel, you can do this by typing ${prefix}set announcements in the desired channel.`)
            break testAnnounce;
        }
		const announcementName = command[1];
		const commander = command.map(x => x);
        function testTime() {
			const commanderHold = commander.map(x => x)
            for(var q = 0; q < 6; q++) {
				commander.shift();
			}
            try {
                announceChannel.send(commander.join(" "));
            } catch {
                message.channel.send(`You must specify an announcements channel, you can do this by typing ${prefix}set announcements in the desired channel.`)
            }
			if (commanderHold[1] == "once") {
				a1.stop();
			}
		}
		dayOfWeek = "*";
		if (commander[1] == "once" || commander[1] == "daily") {
			dayOfWeek = commander[2];
		}
		let a1 = new cron.CronJob(commander[5]+" "+commander[4]+" "+commander[3]+" * * "+dayOfWeek, testTime);
		a1.start();
		message.channel.send("Announcement set at "+commander[3]+":"+commander[4]+":"+commander[5]);
	}
    
    //8BALL 
    else if (command[0] == '8ball') {
        message.react('🎱')
        if (command[1] == undefined) {
            message.reply({
                embed: {"title": "The mythical 8ball responds:",
                "description": "Please ask a question and come back.",
                "color": 4493432,
            }
        })
        } else if (command[command.length - 1].includes(`${prefix}`)) {
            message.reply({
                embed: {"title": "The mythical 8ball responds:",
                "description": ':8ball: ' + eightBall[Math.floor(Math.random() * 8)],
                "color": 4493432,
            }
        })
    
                
                
        } else { 
            message.reply({
                embed: {"title": "The mythical 8ball responds:",
                "description": "Please enter a.",
                "color": 4493432,
            }
        })
        }
    }

    //DATE 
	else if (command[0] == "date") {
		message.channel.send(Date());
	}

    //HELP
    else if (command[0] == 'help') {
        if (command[1] == undefined) {

            message.channel.send({
                embed: {"title": "List of Bot Commands",
                "description": '**Utility:\nset records, records, set announcements, announce (once, daily, weekly) <date>**\n\n**Fun:\nmemes, 8ball, motivation\n\nMusic:\nplay, skip, stop\n\nEnter "**'+prefix+'**help <command name>" to get specific details.**',
                "color": 4493432,
        }
    })

        } else if (command[1] == 'motivation') {
            message.channel.send('Use this command to send a wide variety of motivational pictures')
}
        else if (command[1] == 'memes') {
            message.channel.send('Use this command to send a wide variety of memes')
        }
        else if (command[1] == '8ball') {
            message.channel.send('Ask a question to the 8ball and get an answer')
        }
        else if (command[1] == 'play') {
            message.channel.send(`Enter "${prefix}play <youtube-url-here>" OR "${prefix}play <song name>" while in an voice channel, to play the audio from the video in the Voice Channel`)
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
        else if (command[1] == 'date') {
            message.channel.send('Sends the current date')
        }
        else if (command [1] == 'announce') {
            if (command [2] == undefined) {
                message.channel.send('which announce would you like help with, once, daily, weekly?')
            }
            else if (command[2] == 'once') {
                message.channel.send(`Send an announcement to the announcements channel at a certain time, e.g. ${prefix}announce announcementname once hour minuite second message, EX. ${prefix}announce name once 18 22 00 hello\nThis will print an announcement set at 18 22 00 that says hello`)
            }
            else if (command[2] == 'daily') {
                message.channel.send(`Sends a daily announcement to the announcements channel at the set time e.g. ${prefix}announce announcementname daily hour minuite second message, EX. ${prefix}announce name daily 18 22 00 hello\nThis will print an daily announcement set at 18 22 00 that says hello`)
            }
            else if (command[2] == 'weekly') {
                message.channel.send(`Sends a daily announcement to the announcements channel at the set time e.g. ${prefix}announce announcementname daynumber (Monday 1, Tuesday 2, ... Sunday 7) hour minuite second message, EX. ${prefix}announce name 6 18 22 00 hello\nThis will print an announcement every Saturday set at 18 22 00 that says hello`)
            }
        }
       
    }
});


var urla;
async function execute(message, serverQueue) {
    const secondArgs = message.content.split(" ");
    secondArgs.shift();
    
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

    const r = await yts(secondArgs.join(' ') );
    
    const videos = r.videos.slice( 0, 1 );
    videos.forEach( function ( v ) {
	urla = v.url;
    });
    
    const songInfo = await ytdl.getInfo(urla);
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
    serverQueue.textChannel.send(`I'm playing: **${song.title}** ${urla}`);
    
}


client.login(process.env.TOKEN);