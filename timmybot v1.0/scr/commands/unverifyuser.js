const unverifyuser = async (i) => {
    const { verification } = require('../functions/verification.js')
    try {
        await verification.removeUser(i.user.id)
        i.reply({content: "Successfully unverified user", flags: 64 })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { unverifyuser }