const { functions } = require("../functions/functions")

const restart = async (i) => {
    try {await !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR'))} catch (e) {i.reply({content: "You are not allowed to use this command.", flags: 64 });return}//* stops program if user does not have administrative privileges.

    try { 
        await i.deferReply()
        await functions.ai.stop()
        await functions.ai.start(true)
        await functions.ai.systemMsg('/!\\ Telecommunication system rebooting please wait. /!\\')
    } catch (err) {
        console.log(err);
    }
    //channel.send({ content: "TimmyBot restarted." })
    i.editReply({ content: "TimmyBot restarted." })
    
}

module.exports = { restart }