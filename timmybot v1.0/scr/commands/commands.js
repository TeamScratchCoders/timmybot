const { supervisor, supervisorPermisses } = require('../../../supervisor.js')
let supervisorPermissesBoolean = true
supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})

const commandsNames = [
    'ping',
    'massdelete',
    'restart',
]
let commands = {
    run: (i) => {
        if (i.isCommand()) {
            commands[i.commandName](i)
        }
    }
}

if (supervisorPermissesBoolean) {
    for (let i = 0; i < commandsNames.length; i++) {
        const e = commandsNames[i];
        try {
            commands[e] = require(`./${e}`)[e]
            supervisor.succeed(`successfully loaded ${e} command`)
        } catch (err) {
            supervisor.fail(1, err, `failed to load ${e} command`)
        }

    }
}

module.exports = { commands }