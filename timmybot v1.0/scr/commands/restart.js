const { functions } = require("../functions/functions")

const restart = async (i) => {
    const guild = client.guilds.cache.get(i.guildId)
    const channel = guild.channels.cache.get(i.channelId)

    try { 
        i.reply({ content: "Restarting...", flags: 64 })
        await functions.ai.stop()
        await functions.ai.start()
        await functions.ai.systemMsg('/!\\ Telecommunication system rebooting please wait. /!\\')
    } catch (err) {
        console.log(err);
    }
    channel.send({ content: "TimmyBot restarted." })
    
}

module.exports = { restart }