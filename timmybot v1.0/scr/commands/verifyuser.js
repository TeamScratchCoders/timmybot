const verifyuser = async (i) => {
    try {await !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR'))} catch (e) {i.reply({content: "You are not allowed to use this command.", flags: 64 });return}//* stops program if user does not have administrative privileges.
    try {
        const { verification } = require('../functions/verification.js')
        if (await verification.verifyUserByID(i.options._hoistedOptions[0].value)) {
            i.reply({ content: "Added user to verify members list.", flags: 64 })
        } else {
            i.reply({ content: "Failed to add either to verified members list.", flags: 64 })
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { verifyuser }