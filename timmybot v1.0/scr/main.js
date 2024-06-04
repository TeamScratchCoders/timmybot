//* gets all modules
const { supervisor, supervisorPermisses, } = require('../../supervisor.js');
let supervisorPermissesBoolean = true

supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})

if (supervisorPermissesBoolean) {
    var Client, Events, GatewayIntentBits;
    var client
    var token
    var joinVoiceChannel, createAudioPlayer, createAudioResource
    var ffmpgeg

    if (supervisorPermissesBoolean) {
        try {
            ({ Client, Intents, Events, GatewayIntentBits, ModalBuilder, ActionRowBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ThreadChannel, ChannelType, ThreadAutoArchiveDuration, ThreadMemberManager, Message } = require("discord.js"))
            supervisor.succeed('discord.js module successfully loaded')
        } catch (err) {
            supervisor.fail(1, err, 'discord.js module failed to load')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent,
                ],
            })
            supervisor.succeed('discord.js intense established')
        } catch (err) {
            supervisor.fail(1, err, 'discord.js intense failed to load')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ({ token, guildID, verificationChannelID, ruleChannelID, supportChannelID, aiChannelID } = require('../config.json'))
            supervisor.succeed('successfully loaded config.json')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load config.json')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ffmpgeg = require('ffmpeg-static')
            supervisor.succeed('successfully loaded ffmpeg-static.json')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load ffmpeg-static.json')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ({ joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice'))
            console.log(joinVoiceChannel);
            supervisor.succeed('successfully loaded @discordjs/voice')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load @discordjs/voice')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ({ functions } = require('./functions/functions.js'))
            supervisor.succeed('successfully loaded functions.js')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load functions.js')
        }
    }

    if (supervisorPermissesBoolean) {
        try {
            ({ commands } = require('./commands/commands.js'))
            supervisor.succeed('successfully loaded commands.js')
        } catch (err) {
            supervisor.fail(1, err, 'failed to load commands.js')
        }
    }
}
//* Actual Discord bot
const timmybot = {
    start: function() {
        try {
            client.on('ready', async () => { //! Client Ready
                supervisor.succeed('Successfully Connected to Discord')
                
                const guild = await client.guilds.fetch(guildID)
                const verificationChannel = await guild.channels.fetch(verificationChannelID)
                const ruleChannel = await guild.channels.fetch(ruleChannelID)
                const supportChannel = await guild.channels.fetch(supportChannelID)
                const aiChannel = await guild.channels.fetch(aiChannelID)
                
                functions.joinMessage(verificationChannel, 0)
                functions.joinMessage(ruleChannel, 1)
                functions.joinMessage(supportChannel, 2)
                
                await functions.ai.start()
                
                supervisor.fullyOperational()
                
                setInterval(functions.verification.scanUsers, 60000)

                const command1 = new SlashCommandBuilder()
                    .setName('ping')
                    .setDescription('Replies with pong to check bot latency!')

                const command2 = new SlashCommandBuilder()
                    .setName('massdelete')
                    .setDescription('delete 100 messages')

                const command3 = new SlashCommandBuilder()
                    .setName('restart')
                    .setDescription('restart the the ai browser session')

                await client.application.commands.set([command1, command2, command3])

                
                client.on('interactionCreate', (i) => {
                    commands.run(i)
                    functions.quiz.answer(i)
                    functions.supportTicket.answer(i)
                })

                client.on('messageCreate', async i => {
                    if (!i.author.bot) {
                        functions.messageTracking(i)
                        if (i.channelId == aiChannelID) {
                            try {
                                const message = await functions.ai.msg(i ,guild.members.cache.get(i.author.id).nickname)
                                if (message) {
                                    aiChannel.send(message)
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }
                })
            })
        } catch (err) {
            supervisor.fail(1, err, 'Failed to connect to Discord')
        }

    }
}

module.exports = { timmybot }
client.login(token)