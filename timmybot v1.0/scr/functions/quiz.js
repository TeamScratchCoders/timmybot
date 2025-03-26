const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ModalSubmitInteraction } = require('discord.js')
const { verification } = require('./verification.js')
const fs = require('fs')
const { notify } = require('./peepingTom.js')
const { adultRoleID, youthRoleID } = require('../../config.json')

const quiz = {
    answer: async (interactionOBJ) => {
        function buttonInteraction(interactionOBJ) {
            if (!(interactionOBJ instanceof ButtonInteraction)) {
                throw new Error(`Expected parameter of quiz.answer() to be a ButtonInteraction object. Received: ${typeof interactionOBJ}`);
            }
            const modal = new ModalBuilder()
                .setCustomId('M-000')
                .setTitle('Verification');

            const firstNameInput = new TextInputBuilder()
                .setCustomId('m-000')
                .setLabel('First Name:')
                .setPlaceholder('Johnny')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const lastNameInput = new TextInputBuilder()
                .setCustomId('m-001')
                .setLabel('Last Name:')
                .setPlaceholder('Scout')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const birthDateInput = new TextInputBuilder()
                .setCustomId('m-002')
                .setLabel('Birth Date (MM/DD/YYYY):')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('MM/DD/YYYY')
                .setMaxLength(10)
                .setMinLength(8)

            const actionRow1 = new ActionRowBuilder().addComponents(firstNameInput)
            const actionRow2 = new ActionRowBuilder().addComponents(lastNameInput)
            const actionRow3 = new ActionRowBuilder().addComponents(birthDateInput)

            modal.addComponents(actionRow1, actionRow2, actionRow3)

            interactionOBJ.showModal(modal)
        }

        async function modalInteraction(interactionOBJ) {
            async function verifyMember(memberObj) {
                verification.verifyUser(memberObj)
                console.log(verification.getUserVerification(memberObj));
                if (verification.getUserVerification(memberObj) !== true) {
                    throw new Error("Failed to verify user")
                }
            }

            async function makeProfile(memberObj, firstName, lastName, birthDay) {
                const contents = { id:memberObj.user.id, firstName, lastName, birthDay, messages:null }
                const json = JSON.stringify(contents)
                const path = `timmybot v1.0/assets/users/profile/${memberObj.user.id}.json`
                try {
                    fs.writeFileSync(path, json)
                } catch (err) {
                    throw new Error("Failed to make profile. Error:" + err)
                }
            }

            async function validInput() {
                let invalidInputs = []

                if (!/^[a-z]*$/i.test(firstName)) {
                    invalidInputs.push('`Invalid First Name`')
                }
                if (!/^[a-z]*$/i.test(lastName)) {
                    invalidInputs.push('`Invalid Last Name`')
                }
                if (!/^(0?[1-9](?=\D)|1[0-2])\D(?:0?[1-9]|[1-2]\d|3[0-1])\D\d{4}$/.test(rawbirthDay)) {
                    invalidInputs.push('`Invalid Birth Date`')
                }                
                if (!(await verification.checkUserSecurity(memberObj))) {
                    invalidInputs.push('`You haven\'t disabled your DM\'s`')
                }

                if (invalidInputs.length > 0) {
                    return invalidInputs.reduce((a, b, i) => a + `${i == 0 ? '' : ', '}` + b, '')
                }

                return true
            }

            async function addRole(member, birthDate, firstName, lastName) {
                const eighteenYearsAgo = (Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000) / 1000
                
                if (eighteenYearsAgo > birthDate) {
                    await member.setNickname(`Mr. ${lastName}`)
                    await member.roles.add(adultRoleID)
                } else {
                    await member.setNickname(`${firstName} ${lastName[0]}.`)
                    await member.roles.add(youthRoleID)
                }
            }

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

            const memberObj = interactionOBJ.guild.members.cache.get(interactionOBJ.user.id)

            const firstName = interactionOBJ.fields.getTextInputValue('m-000')
            const lastName = interactionOBJ.fields.getTextInputValue('m-001')
            const rawbirthDay = interactionOBJ.fields.getTextInputValue('m-002')
            const birthDay = getBirthDay(rawbirthDay)
            
            const validInputResult = await validInput()

            if (validInputResult == true) {
                await verifyMember(memberObj)
                    .catch((err) => {
                        console.error(err)
                        interactionOBJ.reply({ content: '### Failed to verify your account. Contact Support', flags: 64 })
                        notify(`Verification Error: Failed to verify ${memberObj.user.username}(${memberObj.id}) Error:${err}`);
                    })
                await makeProfile(memberObj, firstName, lastName, birthDay)
                    .catch(err => {
                        console.error(err)
                        interactionOBJ.reply({ content: '### Failed to Create your Profile. Contact Support', flags: 64 })
                        notify(`Profile Error: Failed to make Profile ${memberObj.user.username}(${memberObj.id}) Error:${err}`);
                    })

                await addRole(memberObj, birthDay, firstName, lastName)
                    .catch(err => {
                        console.error(err)
                        interactionOBJ.reply({ content: '### Failed to add your role. Contact Support', flags: 64 })
                        notify(`Role Error: Failed to add role ${memberObj.user.username}(${memberObj.id}) Error:${err}`);
                    })

                interactionOBJ.reply({ content: '### Successfully verified your account.', flags: 64 })
            } else {
                interactionOBJ.reply({ content: `### Failed to verify your account.\n**Reason**: ${await validInputResult}`, flags: 64 })
            }
        }

        if (interactionOBJ.customId === 'b-000') {
            buttonInteraction(interactionOBJ)
        } else if (interactionOBJ.customId === 'M-000') {
            modalInteraction(interactionOBJ)
        }
    }
}


module.exports = { quiz }