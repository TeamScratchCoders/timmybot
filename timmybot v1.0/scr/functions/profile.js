const { GuildMember, ModalBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputStyle, TextInputBuilder } = require('discord.js')
const { verification } = require('./verification.js')
const { client } = require('../main.js')
const fs = require('fs');

const profile = {
    /**
     * Gets a user's profile.
     * @param {GuildMember|string} member - The user's GuildMember object or user ID.
     * @returns {Object} The user's profile.
     * @throws {TypeError} If the member parameter is not a GuildMember object or a string.
     * @throws {Error} If there is an error reading the user's profile file.
     */
    get: async (member) => {
        const path = `timmybot v1.0/assets/users/profile/`
        try {
            if (member instanceof GuildMember) {
                if (!fs.existsSync(path + member.id + ".json")) {
                    return undefined
                }
                const profile = JSON.parse(fs.readFileSync(path + member.id + ".json", 'utf8'))
                return profile
            } else if (typeof member === 'string') {
                if (!fs.existsSync(path + member + ".json")) {
                    return undefined
                }
                const profile = JSON.parse(fs.readFileSync(path + member + ".json", 'utf8'))
                return profile
            } else {
                throw new TypeError(`Expected member to be a GuildMember object or a string. Received: ${typeof member}`);
            }
        } catch (err) {
            console.log(err);
            return undefined
        }
    },
    /**
     * Makes a new profile for a user.
     * @param {string} id - The user's ID.
     * @param {string} firstName - The user's first name.
     * @param {string} lastName - The user's last name.
     * @param {number} birthDay - The user's birthday, in milliseconds since the Unix epoch.
     * @returns {undefined}
     * @throws {Error} If there is an error writing the user's profile file.
     */
    make: async (id, firstName, lastName, birthDay) => {
        const contents = { id, firstName, lastName, birthDay, messages: null }
        const json = JSON.stringify(contents)
        const path = `timmybot v1.0/assets/users/profile/${id}.json`
        try {
            fs.writeFileSync(path, json)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    },
    delete: async (id) => {
        const path = `timmybot v1.0/assets/users/profile/${id}.json`
        try {
            await fs.unlinkSync(path)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    },
    /**
     * Generates a modal for a user to fill out their profile information.
     * @param {CommandInteraction} i - The CommandInteraction object.
     * @returns {ModalBuilder} - The generated modal.
     */
    modal: (i) => {
        const modal = new ModalBuilder()
            .setCustomId('profileModal')
            .setTitle('Make a Profile')

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

        modal.addComponents(
            new ActionRowBuilder().addComponents(firstNameInput),
            new ActionRowBuilder().addComponents(lastNameInput),
            new ActionRowBuilder().addComponents(birthDateInput),
        )

        return modal
    },
    /**
     * Handles the modal submission for creating a user profile.
     * Extracts the first name, last name, and birth date from the modal fields,
     * converts the birth date to a timestamp, and creates a profile for the user.
     * Sends a confirmation reply once the profile is created.
     * 
     * @param {ModalSubmitInteraction} i - The interaction object representing the modal submission.
     */
    modalHandler: async (i) => {
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

        async function validInput(firstName, lastName, rawbirthDay, memberObj) {
            let invalidInputs = []

            if (!/^[a-z]*$/i.test(firstName)) {
                invalidInputs.push('\n`Invalid First Name`')
            }
            if (!/^[a-z]*$/i.test(lastName)) {
                invalidInputs.push('\n`Invalid Last Name`')
            }
            if (!/^(0?[1-9](?=\D)|1[0-2])\D(?:0?[1-9]|[1-2]\d|3[0-1])\D\d{4}$/.test(rawbirthDay)) {
                invalidInputs.push('\n`Invalid Birth Date`')
            }
            if (!(await verification.checkUserSecurity(memberObj))) {
                invalidInputs.push('\n`You haven\'t disabled your DM\'s`')
            }

            if (invalidInputs.length > 0) {
                return invalidInputs.reduce((a, b, i) => a + `${i == 0 ? '' : ', '}` + b, '')
            }

            return true
        }

        if (i.customId === 'profileModal') {
            const firstName = i.fields.getTextInputValue('m-000')
            const lastName = i.fields.getTextInputValue('m-001')
            const rawbirthDay = i.fields.getTextInputValue('m-002')
            const birthDay = getBirthDay(rawbirthDay)

            const guild = client.guilds.cache.get(i.guildId)
            const member = guild.members.cache.get(i.user.id)

            const validInputs = await validInput(firstName, lastName, rawbirthDay, member)

            if (await profile.get(i.user.id)) {
                i.reply({ content: 'You already have a profile.', flags: 64 })
                return
            }

            if (validInputs == true) {
                profile.make(i.user.id, firstName, lastName, birthDay)
                    .then((result) => {
                        if (result) {
                            i.reply({ content: 'Profile made!', flags: 64 })
                        } else {
                            i.reply({ content: 'Something went wrong.', flags: 64 })   
                        }
                    })
            } else {
                i.reply({ content: `Invalid inputs: ${validInputs}`, flags: 64 })
            }
        }
    },
    buttonHandler: async (i) => {
        if (i.customId === 'profileButton') {
            if (await profile.get(i.user.id)) {
                i.reply({ content: 'You already have a profile.', flags: 64 })
                return
            }
            const modal = profile.modal(i)
            await i.showModal(modal)
            return
        }
    },
    handleNoProfile: async (i) => {
        const guild = client.guilds.cache.get(i.guildId)
        const channel = guild.channels.cache.get(i.channelId)

        const messages = await channel.messages.fetch({ limit: 2 })
        const message = messages.last()
        if (message.author.bot && message.content == `<@${i.author.id}>, You do not have a profile yet. you can't talk to Timmy.`) {
            await i.delete()
            return
        }

        const button = new ButtonBuilder()
            .setLabel('Make a Profile')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('profileButton')

        const row = new ActionRowBuilder()
            .addComponents(button)

        await i.reply({ content: `<@${i.author.id}>, You do not have a profile yet. you can't talk to Timmy.`, components: [row] })
        await i.delete()
    }
}

module.exports = { profile }