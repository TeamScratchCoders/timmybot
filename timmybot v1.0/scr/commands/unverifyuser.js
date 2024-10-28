const unverifyuser = async (i) => {
    try {await !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR'))} catch (e) {i.reply({content: "You are not allowed to use this command.", flags: 64 });return}//* stops program if user does not have administrative privileges.
    const { verification } = require('../functions/verification.js')
    try {
        await verification.removeUser(i.user.id)
        i.reply({content: "Successfully unverified user", flags: 64 })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { unverifyuser }