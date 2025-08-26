const { supervisor } = require('../../../supervisor.js')
const { client } = require('../main.js')
const { SlashCommandBuilder } = require('discord.js')

const commandsNames = [
    'ping',
    'massdelete',
    'restart',
    'verifyuser',
    'unverifyuser',
    'madlib',
    'timeout',
    'level',
    'makeid'
]
const commandsDescription = {
    "ping": 'pings the bot',
    "massdelete": 'massdeletes 100 messages',
    "restart": 'reboots the bot',
    "verifyuser": 'adds an user to the verified list',
    "unverifyuser": 'removes an user from the verified list',
    "madlib": 'Creates a Mad Lib you can fill out.',
    "timeout": 'Times out people.',
    "level": 'Checks your level',
    "makeid": 'Makes you a ID'
}

let commandAccumulator = []

const commands = {
    run: (i) => {
        if (i.isCommand()) {
            commands[i.commandName](i)
        }
    },
    initialize: async () => {
        try {
            for (let i = 0; i < commandsNames.length; i++) {
                const e = commandsNames[i]
                const tempcammand = new SlashCommandBuilder()
                    .setName(e)
                    .setDescription(commandsDescription[e])

                if (e == 'verifyuser') {
                    tempcammand.addUserOption(option =>
                        option
                            .setName('user')
                            .setDescription('Select a user to add to the verified list')
                            .setRequired(true)
                    )
                } else if (e == 'unverifyuser') {
                    tempcammand.addUserOption(option =>
                        option
                            .setName('user')
                            .setDescription('Select a user to remove from the verified list')
                            .setRequired(true)
                    )
                } else if (e == 'timeout') {
                    tempcammand
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('Select a user to timeout')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('duration')
                                .setDescription('Set the Minutes the user is timed out by')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('reason')
                                .setDescription('Reason for the timeout')
                                .setRequired(false)
                        )
                } else if (e == 'makeid') {
                    tempcammand
                        .addStringOption(option =>
                            option
                                .setName('first-name')
                                .setDescription('Set the first name')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('last-name')
                                .setDescription('Set the last name')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('birthday-date')
                                .setDescription('Foremat:(MM/DD/YYYY). Set the Birthday')
                                .setRequired(true)
                                .setMinLength(10)
                                .setMaxLength(10)
                        )
                        .addStringOption(option =>
                            option
                                .setName('position')
                                .setDescription('Set the Position')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('position-date')
                                .setDescription('Foremat:(MM/DD/YYYY). Set the Position Start Date')
                                .setRequired(true)
                                .setMinLength(10)
                                .setMaxLength(10)
                        )
                        .addStringOption(option =>
                            option
                                .setName('rank')
                                .setDescription('Set the Rank')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('patrol')
                                .setDescription('Set the Patrol')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('issued-date')
                                .setDescription('Foremat:(MM/DD/YYYY). The Date the ID was issued.')
                                .setRequired(true)
                                .setMinLength(10)
                                .setMaxLength(10)
                        )
                        .addAttachmentOption(option =>
                            option
                                .setName('photo')
                                .setDescription('Set the Photo of the ID')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('totin-chit')
                                .setDescription('A badge on the ID showing if you have a Totin Chit')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('fireman-chit')
                                .setDescription('A badge on the ID showing if you have a Fireman Chit')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('cyber-chit')
                                .setDescription('A badge on the ID showing if you have a Cyber Chit')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('nylt-training')
                                .setDescription('A badge on the ID showing if you have NYLT Training')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('wood-badge-training')
                                .setDescription('A badge on the ID showing if you have Wood Badge Training')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('oa-membership')
                                .setDescription('A badge on the ID showing if you are a OA Member')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'True', value: 'true' },
                                    { name: 'False', value: 'false' }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('position-end-date')
                                .setDescription('Foremat:(MM/DD/YYYY). If left out it will automatically set it to 6 months from start date.')
                                .setRequired(false)
                                .setMinLength(10)
                                .setMaxLength(10)
                        )
                        .addStringOption(option =>
                            option
                                .setName('expires-date')
                                .setDescription('Foremat:(MM/DD/YYYY). If left out it will automatically set it to 6 months from start date.')
                                .setRequired(false)
                                .setMinLength(10)
                                .setMaxLength(10)
                        )
                }
                commandAccumulator.push(tempcammand)
            }
            supervisor.succeed('Perpare to PUSH commands to discord')
            await client.application.commands.set(commandAccumulator)
            supervisor.succeed('commands successfully pushed to discord')
        } catch (err) {
            console.log(err);
        }
    }
}

for (let i = 0; i < commandsNames.length; i++) {
    const e = commandsNames[i];
    try {
        ({ [e]: commands[e] } = require(`./${e}`))
        supervisor.succeed(`successfully loaded ${e} command`)
    } catch (err) {
        supervisor.fail(1, err, `failed to load ${e} command`)
    }
}

module.exports = { commands }