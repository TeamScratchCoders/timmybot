const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const { verification } = require('./verification.js')
const fs = require('fs')
const quizMessage = JSON.parse(fs.readFileSync('timmybot v1.0/assets/quiz/quizMessage.json', 'utf8'))
const { guildID } = require('../../config.json')
let questionnaireProgress = {
  bob: [
    's-001',
    'm-001'
  ]
}
const quiz = {
    answer: async function(i) {
        if (!questionnaireProgress[i.user.id]) {
          questionnaireProgress[i.user.id] = [];
        }

        if (i.customId === 'b-000') { //* initial interaction
          if (await verification.checkUserPreVerification(i)) {
            i.reply(quizMessage.message[0])
          }
        }
        if (i.customId === 'S-000') { //* adult or youth
          if (await verification.checkUserPreVerification(i)) {
            if (i.values == 's-000') { //* adult
              questionnaireProgress[i.user.id] = []
              i.update(quizMessage.message[1])
              questionnaireProgress[i.user.id].push('s-000')
            } else { //* youth
              questionnaireProgress[i.user.id] = []
              i.update(quizMessage.message[4])
              questionnaireProgress[i.user.id].push('s-001')
            }
          }
        }
        if (i.customId === 'S-001') { //* adult achievements
          if (!((i.values.includes('s-002') && i.values.length == 1))) {
            if (await verification.checkUserPreVerification(i)) {
              i.update(quizMessage.message[2])
            }
          } else {
            callHonorific(i)
          }
          questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
        }
        if (i.customId === 'S-002') { //* adult would badge Patrol
          if (i.values.includes('s-013')) {
            if (await verification.checkUserPreVerification(i)) {
              i.update(quizMessage.message[3])
            }
          } else {
            callHonorific(i)
          }
          questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
        }
        if (i.customId === 'S-003') { //* adult Honorific
          callHonorific(i)
          questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
        }
        if (i.customId === 'S-004') { //* youth Patrol
          if (await verification.checkUserPreVerification(i)) {
            i.update(quizMessage.message[5])
            questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          }
        }
        if (i.customId === 'S-005') { //* Youth position
          if (await verification.checkUserPreVerification(i)) {
            i.update(quizMessage.message[6])
            questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          }
        }
        if (i.customId === 'S-006') { //*Youth rank
          if (await verification.checkUserPreVerification(i)) {
            i.update(quizMessage.message[7])
            questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          }
        }
        if (i.customId === 'S-007') { //*Youth achievements
          if (await verification.checkUserPreVerification(i)) {
            i.update(quizMessage.message[8])
            questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          }
        }
        if (i.customId === 'S-008') { //*Youth achievements
          if (await verification.checkUserPreVerification(i)) {
            callModal(i)
            questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          }
        }


        if (i.isModalSubmit()) {
          if (await verification.checkUserPreVerification(i)) {
            const guild = await client.guilds.fetch(guildID)
            const member = await guild.members.fetch(i.user.id)

            const honorific = quizMessage.rolls[(questionnaireProgress[i.user.id][questionnaireProgress[i.user.id].length - 1])]

            const firstName = i.components[0].components[0].value
            const lastName = i.components[1].components[0].value

            if (honorific === null) {
              await member.setNickname(`${firstName} ${lastName[0]}.`)
            } else {
              await member.setNickname(`${honorific}. ${lastName}`)
            }

            i.update(quizMessage.message[10])
            calculateRoles(questionnaireProgress[i.user.id])
            verification.verifyUser(i)
          }
        }

        if (i.customId === 'S-009') {
          questionnaireProgress[i.user.id] = [...questionnaireProgress[i.user.id], ...i.values]
          callModal(i)
        }

        async function callHonorific(i) {
          i.update(quizMessage.message[9])
        }

        async function callModal(i) {
          const modal = new ModalBuilder()
            .setCustomId('M-000')
            .setTitle('My Modal');

          const fNameInput = new TextInputBuilder()
            .setCustomId('m-000')
            .setLabel('What is you\'r first Name?')
            .setStyle(TextInputStyle.Short)

          const lNameInput = new TextInputBuilder()
            .setCustomId('m-001')
            .setLabel('What is you\'r last Name?')
            .setStyle(TextInputStyle.Short)

          const actionRow1 = new ActionRowBuilder().addComponents(fNameInput)
          const actionRow2 = new ActionRowBuilder().addComponents(lNameInput)

          modal.addComponents(actionRow1, actionRow2)

          await i.showModal(modal)
        }

        async function calculateRoles(r) {
          for (let i2 = 0; i2 < r.length; i2++) {
            const e = r[i2]
            if (/^\d{19}$/.test(quizMessage.rolls[e])) {
              i.member.roles.add(quizMessage.rolls[e])
            }
          }
        }
    },
}


module.exports = { quiz }