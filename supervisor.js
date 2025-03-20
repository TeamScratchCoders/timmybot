let chalk
try {
    chalk = require('chalk')
    console.log(`[ ${chalk.green('OK')} ] chalk module successfully loaded`)
} catch (err) {
    console.log(`chalk didn't not look ~_~!`)
}

const supervisor = {
    fail: function(exitCode, err, s) {
        console.log(`[ ${chalk.red('FAIL')} ] ${s}, Exit Code:${exitCode}`)
        console.log(err);
    },
    succeed: function(s) {
        console.log(`[ ${chalk.green('OK')} ] ${s}`)
    }
}

module.exports = { supervisor }