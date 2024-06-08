const verifyuser = async (i) => {
    const { verification } = require('../functions/verification.js')
    try {
        await verification.verifyUserByID(i.user.id)
        i.reply({content: "Successfully verified user", flags: 64 })
    } catch (err) {
        console.log(err);
    }

}

module.exports = { verifyuser }