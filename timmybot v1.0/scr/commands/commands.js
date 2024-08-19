const { supervisor, supervisorPermisses } = require('../../../supervisor.js')
let supervisorPermissesBoolean = true
supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})

const commandsNames = [
    'ping',
    'massdelete',
    'restart',
    'verifyuser',
    'unverifyuser',
    'madlib',
    'scoutskills'
]
const commandsDescription = {
    "ping": 'pings the bot',
    "massdelete": 'massdeletes 100 messages',
    "restart": 'reboots the bot',
    "verifyuser": 'adds an user to the verified list',
    "unverifyuser": 'removes an user from the verified list',
    "madlib": 'Creates a Mad Lib you can fill out.',
    "scoutskills": 'Test you scout skills'
}

let commandsBilt

let commands = {
    run: (i) => {
        if (i.isCommand()) {
            commands[i.commandName](i)
        }
    },
    initialize: async () => { 
        try {
            await !(client.application == null)
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
                }
                if (commandsBilt == undefined) {
                    commandsBilt = [tempcammand]
                } else {
                    commandsBilt.push(tempcammand)
                }
            }
            await client.application.commands.set(commandsBilt)
        } catch (err) {
            console.log(err);
        }
    }
}

if (supervisorPermissesBoolean) {
    for (let i = 0; i < commandsNames.length; i++) {
        const e = commandsNames[i];
        try {
            ( { [e]: commands[e] } = require(`./${e}`))
            supervisor.succeed(`successfully loaded ${e} command`)
        } catch (err) {
            supervisor.fail(1, err, `failed to load ${e} command`)
        }

    }
}

module.exports = { commands }