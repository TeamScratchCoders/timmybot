const { log } = require('console')
const { EventEmitter } = require('events')
let chalk
try {
    chalk = require('chalk')
    console.log(`[ ${chalk.green('OK')} ] chalk module successfully loaded`)
} catch (err) {
    console.log(`chalk didn't not look ~_~!`)
}

supervisorPermisses = new EventEmitter()

const supervisor = {
    fail: function(exitCode, err, s) {
        supervisorPermisses.emit('fail')
        console.log(`[ ${chalk.red('FAIL')} ] ${s}, Exit Code:${exitCode}`)
        console.log(err);
    },
    succeed: function(s) {
        console.log(`[ ${chalk.green('OK')} ] ${s}`)
    },
    fullyOperational: function() {
        supervisorPermisses.emit('fullyOperational')
    }
}



module.exports = { supervisor, supervisorPermisses}