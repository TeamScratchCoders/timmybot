const { functions } = require('../../scr/functions/functions.js')
const { botCommandChannelID } = require('../../config.json');

const madlib = async (i) => {
    if (i.channelId == botCommandChannelID) {     
        await functions.madlibFunc.newStart(i)
    }
}

module.exports = { madlib }