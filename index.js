const { supervisor } = require('./supervisor.js')
const { testMode } = require('./timmybot v1.0/config.json')

let timmybot
let chalk
let fs

try {
    fs = require('fs')
    supervisor.succeed('fs module successfully loaded')
} catch (err) {
    supervisor.fail(1, err, 'fs module failed to load')
}

const path = "timmybot v1.0/config.json"
const jsonObj = {
    token: "",
    aiChat: "",
    aiCookieValue: "",
    guildID: "",
    verificationChannelID: "",
    ruleChannelID: "",
    supportChannelID: "",
    aiChannelID: "",
    webmasterRoleID: "",
    moderatorLogsChannelID: "",
    botCommandChannelID: "",
    generalChannelID: "",
    aiDnD: "",
    emailPassword: "",
    email: "",
    emailHost: "",
    emailservice: "",
    adminEmail: "",
    testMode: false
}

function accessConif() {
    try {
        fs.accessSync(path, fs.constants.F_OK)
        return true
    } catch (error) {
        return false
    }
}

try {
    if (accessConif()) {
        supervisor.succeed('config.json instated')
    } else {
        try {
            fs.writeFileSync(path, JSON.stringify(jsonObj, null, 2), 'utf8')

            supervisor.succeed('successful generated confit.json')
        } catch (err) {
            supervisor.fail(1, err, 'failed to generate config.json')
        }
    }
} catch (err) {
    supervisor.fail(1, err, 'failed to check for config.json')
}

try {
    chalk = require('chalk')
    console.log(`[ ${chalk.green('OK')} ] chalk module successfully loaded`)
} catch (err) {
    console.log(`chalk didn't not look ~_~!`)
}

try {
    ({ timmybot } = require('./timmybot v1.0/scr/main.js'))
    supervisor.succeed('main.js successfully loaded')
} catch (err) {
    supervisor.fail(1, err, 'failed to load main.js')
}

try {
    if (testMode) {
        timmybot.test()
    } else {
        timmybot.start()
    }
} catch (err) {
    supervisor.fail(1, err, 'l')
}