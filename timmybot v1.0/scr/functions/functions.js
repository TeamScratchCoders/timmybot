const { supervisor } = require('../../../supervisor.js')

const functionNames = [
    'joinMessage',
    'quiz',
    //'verification',
    'supportTicket',
    'ai',
    'role',
    'messageTracking',
    'madlibFunc',
    'peepingTom'
]
let functions = {};

for (let i = 0; i < functionNames.length; i++) {
    const e = functionNames[i];
    try {
        functions[e] = require(`./${e}`)[e]
        supervisor.succeed(`successfully loaded ${e} function`)
    } catch (err) {
        supervisor.fail(1, err, `failed to load ${e} function`)
    }
}

module.exports = { functions }
