const { supervisor, supervisorPermisses } = require('../../../supervisor.js')
let supervisorPermissesBoolean = true
supervisorPermisses.on('fail', () => {
    supervisorPermissesBoolean = false
})
const functionNames = [
    'joinMessage',
    'quiz',
    'verification',
    'supportTicket',
    'ai',
    'role',
    'messageTracking',
    'madlibFunc',
    'scoutskills',
    'peepingTom'
]
let functions = {};

if (supervisorPermissesBoolean) {
    for (let i = 0; i < functionNames.length; i++) {
        const e = functionNames[i];
        try {
            functions[e] = require(`./${e}`)[e]
            supervisor.succeed(`successfully loaded ${e} function`)
        } catch (err) {
            supervisor.fail(1, err, `failed to load ${e} function`)
        }

    }
}

module.exports = { functions }
