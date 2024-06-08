const verifyuser = async (i) => {
    const verification = require('../functions/verification.js')
    console.log(i.options._hoistedOptions[0].value)
    console.log(verification);
    try {
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