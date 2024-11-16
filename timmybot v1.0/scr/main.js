//* gets all modules
const { supervisor } = require('../../supervisor.js');

const contentWarningMessage = {
    content: ``,
    embeds: [
        {
            id: 593955793,
            description: `# 🚨  INAPPROPRIATE CONTENT   🚨\nThis is a warning, warns about Sussy wussy content that Timmy tried to generate. It's your fault isn't it. Anyways stop doing it! \n\n# NOW!\n** **`,
            color: 16711680
        }
    ]
}

var Client, Events, GatewayIntentBits;
var client
var token
var joinVoiceChannel, createAudioPlayer, createAudioResource
var ffmpgeg
try {
    ({ Client, Intents, Events, GatewayIntentBits, ModalBuilder, ActionRowBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ThreadChannel, ChannelType, ThreadAutoArchiveDuration, ThreadMemberManager, Message } = require("discord.js"))
    supervisor.succeed('discord.js module successfully loaded')
} catch (err) {
    supervisor.fail(1, err, 'discord.js module failed to load')
}
try {
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageTyping,
        ],
    })
    supervisor.succeed('discord.js intense established')
} catch (err) {
    supervisor.fail(1, err, 'discord.js intense failed to load')
}
try {
    ({ token, guildID, verificationChannelID, ruleChannelID, supportChannelID, aiChannelID, botCommandChannelID } = require('../config.json'))
    supervisor.succeed('successfully loaded config.json')
} catch (err) {
    supervisor.fail(1, err, 'failed to load config.json')
}
try {
    ffmpgeg = require('ffmpeg-static')
    supervisor.succeed('successfully loaded ffmpeg-static.json')
} catch (err) {
    supervisor.fail(1, err, 'failed to load ffmpeg-static.json')
}
try {
    ({ joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice'))
    supervisor.succeed('successfully loaded @discordjs/voice')
} catch (err) {
    supervisor.fail(1, err, 'failed to load @discordjs/voice')
}
try {
    ({ functions } = require('./functions/functions.js'))
    supervisor.succeed('successfully loaded functions.js')
} catch (err) {
    supervisor.fail(1, err, 'failed to load functions.js')
}
try {
    ({ commands } = require('./commands/commands.js'))
    supervisor.succeed('successfully loaded commands.js')
} catch (err) {
    supervisor.fail(1, err, 'failed to load commands.js')
}

function imageToUrl(i) {
    try {
        return [
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/png').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/jpeg').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/webp').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/gif').map(att => att.url)
        ]
    } catch (err) {
        return null
    }
}

//* Actual Discord bot
const timmybot = {
    start: function () {
        client.on('ready', async () => { //! Client Ready

            const guild = await client.guilds.fetch(guildID)
            const verificationChannel = await guild.channels.fetch(verificationChannelID)
            const ruleChannel = await guild.channels.fetch(ruleChannelID)
            const supportChannel = await guild.channels.fetch(supportChannelID)
            const aiChannel = await guild.channels.fetch(aiChannelID)

            
            await functions.joinMessage(verificationChannel, 0)
            await functions.joinMessage(ruleChannel, 1)
            await functions.joinMessage(supportChannel, 2)
            
            try {
                await functions.ai.start()
                supervisor.succeed('AI successfully started')
            } catch (err) {
                supervisor.fail(1, err, 'AI failed to start')
            }
            
            await functions.peepingTom.initializeInstance()
            
            try {
                await commands.initialize()
                supervisor.succeed('commands successfully started')
            } catch (err) {
                supervisor.fail(1, err, 'commands failed to start')
            }
            
            setInterval(functions.verification.scanUsers, 60000)
            
            client.on('interactionCreate', (i) => {
                commands.run(i)
                functions.scoutskills.processInput(i)
                functions.quiz.answer(i)
                functions.supportTicket.answer(i)
            })
            
            client.on('typingStart', (i) => {
                console.log('Typing...');
                if (i.channel.id === aiChannelID) {
                }
            })
            
            client.on('messageCreate', async i => {
                if (!i.author.bot) {
                    if (/cook/gi.test(i.content)) {
                        i.reply({ content: "Jesse we need to cook." })
                    }

                    functions.messageTracking(i)
                    if (i.channelId == aiChannelID) {
                        try {
                            const message = await functions.ai.msg(i, guild.members.cache.get(i.author.id).nickname, imageToUrl(i))
                            if (message) {
                                aiChannel.send(message)
                            } else if (message == false) {
                                aiChannel.send(contentWarningMessage)
                                functions.peepingTom.notify(`${guild.members.cache.get(i.author.id).nickname} has trigerd the content filter.`)
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    if (i.channelId == "1300952736497406065") {
                        console.log([...guild.channels.cache.get("1300952736497406065").members.keys()]);

                    }



                    try {
                        //if (i.channelId == botCommandChannelID) {
                        if (i.channelId == '1248115163656360050') {
                            if (i.mentions.repliedUser.username == 'TimmyBot') {
                                console.log(i);
                                functions.madlibFunc.addWord(i)
                                console.log(i.mentions.repliedUser.username);
                            }
                        }
                    } catch (err) { }
                }
            })
            supervisor.fullyOperational()
        })
    }
}

module.exports = { timmybot }
client.login(token)