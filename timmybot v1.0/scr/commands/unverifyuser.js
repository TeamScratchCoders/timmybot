const unverifyuser = async (i) => {
    try {await !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR'))} catch (e) {i.reply({content: "You are not allowed to use this command.", flags: 64 });return}//* stops program if user does not have administrative privileges.
    const { verification } = require('../functions/verification.js')
    try {
        const { verification } = require('../functions/verification.js')
        console.log(i.options._hoistedOptions[0].value);
        const member = i.guild.members.cache.get(i.options._hoistedOptions[0].value)
        verification.unverifyUser(member)
        if (verification.getUserVerification(member) === true) {
            i.reply({ content: "Removed user to verify members list.", flags: 64 })
        } else {
            i.reply({ content: "Failed to remove either to verified members list.", flags: 64 })
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { unverifyuser }