const { functions } = require('../../scr/functions/functions.js')

const madlib = async (i) => {
    await functions.madlibFunc.newStart(i)
}

module.exports = { madlib }