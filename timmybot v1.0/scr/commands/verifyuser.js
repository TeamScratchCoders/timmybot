const verifyuser = async (i) => {
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