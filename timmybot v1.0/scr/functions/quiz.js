const { adultRoleID, youthRoleID } = require('../../config.json')
const { verificationChannelID } = require('../../config.json')
const { verification } = require('./verification.js')


function getBirthDay(birthDate) {
    const regexMonth = /^(?:0?[1-9](?=\D)|1[0-2])/
    const regexDay = /(?<=\D)(0?[1-9]|[1-2]\d|3[0-1])(?=\D)/
    const regexYear = /(?<=\D)\d{4}/

    const month = parseInt(birthDate.match(regexMonth))
    const day = parseInt(birthDate.match(regexDay))
    const year = parseInt(birthDate.match(regexYear))

    const date = new Date(Date.UTC(year, month - 1, day));
    return Math.floor(date.getTime() / 1000);
}

const quiz = {
    answer: async (interactionOBJ) => {
        if (interactionOBJ.customId === 'profileModal' && interactionOBJ.channelId === verificationChannelID) {
            verification.verifyUser(interactionOBJ.user.id)

            const rawbirthDay = interactionOBJ.fields.getTextInputValue('m-002')
            const birthDate = getBirthDay(rawbirthDay)

            if (birthDate - 567648000 >= 0) {
                interactionOBJ.member.roles.add(youthRoleID);
                interactionOBJ.member.setNickname(`${interactionOBJ.fields.getTextInputValue('m-000')} ${interactionOBJ.fields.getTextInputValue('m-001')[0]}.`);
            } else {
                interactionOBJ.member.roles.add(adultRoleID);
                interactionOBJ.member.setNickname(`Mr. ${interactionOBJ.fields.getTextInputValue('m-001')}`);
            }
        }
    }
}


module.exports = { quiz }