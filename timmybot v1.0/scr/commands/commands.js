const { supervisor, supervisorPermisses } = require('../../../supervisor.js')
let supervisorPermissesBoolean = true
supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})
const commandsNames = [
    'test',
]
let commands = {};

if (supervisorPermissesBoolean) {
    for (let i = 0; i < commandsNames.length; i++) {
        const e = commandsNames[i];
        try {
            commands[e] = require(`./${e}`)[e]
            supervisor.succeed(`successfully loaded ${e} commands`)
        } catch (err) {
            supervisor.fail(1, err, `failed to load ${e} commands`)
        }

    }
}

module.exports = { commands }
