const { profile } = require('./../functions/profile.js')
const { botCommandChannelID } = require('../../config.json')

function getlevel(currentXP, baseXP = 100) {
    let count = 0;
    let subtract = baseXP;
    while (currentXP >= subtract) {
        subtract += baseXP * Math.log(count + 1);
        count++;
    }
    return count
}
const level = async (i) => {
    if (await profile.get(i.user.id) == undefined) {
        profile.handleNoProfile(i)
        return
    }
    await profile.setMessages(i.user.id)
    const memberProfile = await profile.get(i.user.id)
    
    if (botCommandChannelID == i.channelId) {
        await i.reply({ content: `${getlevel(memberProfile.messages)}` })
    } else {
        await i.reply({ content: `${getlevel(memberProfile.messages)}`, flags: 64 })
    }
}

module.exports = { level }