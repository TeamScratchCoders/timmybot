const { functions } = require("../functions/functions")

const setName = `restart`
const setDescription = 'restart the the ai browser session'
const restart = async (i) => {
    const guild = client.guilds.cache.get(i.guildId)
    const channel = guild.channels.cache.get(i.channelId)

    try { 
        await i.deferReply()
        await functions.ai.stop()
        await functions.ai.start()
        await functions.ai.systemMsg('/!\\ Telecommunication system rebooting please wait. /!\\')
    } catch (err) {
        console.log(err);
    }
    //channel.send({ content: "TimmyBot restarted." })
    i.editReply({ content: "TimmyBot restarted." })
    
}

module.exports = { restart }