const fs = require('fs')
const verificationMessageJSON = require('../../assets/messages/joiningMessage.json')
const ruleMessageJSON = require('../../assets/messages/rulesMessage.json')
const supportMessageJSON = require('../../assets/messages/supportMessage.json')
const joinMessage = async function(channel, version) {
    const messages = await channel.messages.fetch({ limit: 100 })
    await channel.bulkDelete(messages)
    if (version == 0) {
        await channel.send(verificationMessageJSON)
    } else if (version == 1) {
        await channel.send(ruleMessageJSON)
    } else if (version == 2) {
        await channel.send(supportMessageJSON)
    }
}


module.exports = { joinMessage }
