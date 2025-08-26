const path = require('path')
const { client } = require('../main.js')
const { guildID, moderatorLogsChannelID } = require('../../config.json');
const { EmbedBuilder, CommandInteraction } = require('@discordjs/builders');

/**
 * Times out user and sends a message to moderator logs and the channel where the user was timed out in.
 * @param {import('discord.js').CommandInteraction} i - The Interaction object of the command.
 * 
 * @throws {TypeError} If the interaction object of the command is not of type CommandInteraction
 * @throws {TypeError} Expected number from `getTime` function.
 * @throws {Error} If the program fails to time out a user
 * @throws {Error} General error
 */
const timeout = async (i) => {
    if (typeof i === CommandInteraction) {
        throw new TypeError('Parameter of the Timeout Command must be of type CommandInteraction');
    }

    try { !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR')) } catch (e) { i.reply({ content: "You are not allowed to use this command. :face_with_raised_eyebrow:", flags: 64 }); return }//* stops program if user does not have administrative privileges.
    try {
        /**
         * Creates a message to be sent to the channel where the user was timed out in.
         * @param {import('discord.js').CommandInteraction} CommandInteraction
         * @param {import('discord.js').GuildMember} membersObj
         * @returns {Object}
         */
        function message(CommandInteraction, membersObj) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`# <@${CommandInteraction.user.id}> Timed out <@${membersObj.id}>`)
                .setAuthor({
                    name: `${CommandInteraction.member.nickname}`,
                    iconURL: `https://cdn.discordapp.com/avatars/${CommandInteraction.user.id}/${CommandInteraction.user.avatar}.webp?size=128`
                })
                .setTimestamp()
                .setFooter({
                    text: 'Timmy is watching'
                });

            const videoPath0 = path.join(__dirname, '../../assets/video/you_reached_your_limit_on_talking.mp4')
            const videoPath1 = path.join(__dirname, '../../assets/video/shut_yo.mp4')
            const videoPath2 = path.join(__dirname, '../../assets/video/how_about_a_nice_cup_of.mp4')

            const videoPaths = [videoPath0, videoPath1, videoPath2];
            const videoPath = videoPaths[Math.floor(Math.random() * videoPaths.length)];
            
            return { embeds: [embed], files: [videoPath] }
        }

        /**
         * Creates a message to be sent to the moderator logs channel.
         * @param {import('discord.js').CommandInteraction} CommandInteraction
         * @param {import('discord.js').GuildMember} membersObj
         * @returns {Object}
         */
        function modMessage(CommandInteraction, membersObj) {
            const modEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`# <@${CommandInteraction.user.id}> Timed out <@${membersObj.id}>\n### Reason: "${CommandInteraction.options._hoistedOptions[2]?.value || 'No reason stated.'}"\n### Duration: ${CommandInteraction.options._hoistedOptions[1].value}`)
                .setAuthor({
                    name: `${CommandInteraction.member.nickname}`,
                    iconURL: `https://cdn.discordapp.com/avatars/${CommandInteraction.user.id}/${CommandInteraction.user.avatar}.webp?size=128`
                })
                .setTimestamp()
                .setFooter({
                    text: 'Timmy is watching'
                });

            return { embeds: [modEmbed] }
        }

        /**
        * Inputs a string describing time and outputs the time in milliseconds
        * @param {string} input - The time string (e.g., "1h 30m").
        * @returns {number} The total duration in milliseconds. 
        * 
        * @example
        * // returns 5400000
        * getTime("1h 30m")'
        */
        function getTime(input) {
            if (typeof input !== "string") {
                throw new Error("getTime Function only accepts strings.");
            }
            function makeRegex(name, char) {
                return new RegExp(`\\d+(?=[\\s.,=:;{}[\\]()\\-]?((${name}(?![a-z]))|${char}(s)?))`, "i")
            }

            const obj = [
                { name: 'year', char: 'y', time: 31536000000 },
                { name: 'month', char: 'mo', time: 2592000000 },
                { name: 'week', char: 'w', time: 604800000 },
                { name: 'day', char: 'd', time: 86400000 },
                { name: 'hour', char: 'h', time: 3600000 },
                { name: 'minute', char: 'm', time: 60000 },
                { name: 'second', char: 's', time: 1000 },
                { name: 'millisecond', char: 'ms', time: 1 },
            ]
            let accumulator = 0

            obj.forEach(({ name, char, time }) => {
                const regex = makeRegex(name, char)
                if (regex.test(input)) {
                    let match = input.match(regex)
                    accumulator += time * parseInt(match)
                }
            })

            return accumulator
        }


        const guild = await client.guilds.cache.get(guildID)
        const modlogschannel = await guild.channels.fetch(moderatorLogsChannelID)
        const membersObj = await guild.members.fetch(i.options._hoistedOptions[0].user.id)

        let hasAdministrator

        try { hasAdministrator = (membersObj.permissions.has('ADMINISTRATOR')) } catch (e) { hasAdministrator = false }

        if (hasAdministrator) {
            i.reply({ content: "User has Administrator permissions. You cant time him out asshole.", flags: 64 })
        } else {
            const timeoutTime = getTime(i.options._hoistedOptions[1].value)
            const timeoutReason = i.options._hoistedOptions.length > 2 ? `${i.member.nickname} Timed you out: ${i.options._hoistedOptions[2].value}` : `${i.member.nickname} Timed you out: no reason provided`

            if (typeof timeoutTime !== 'number') {
                i.reply({ content: "Invalid time format. An error has occurred.", flags: 64 })
                throw new TypeError(`Failed to parse duration input. getTime function returned ${timeoutTime} typeof: ${typeof timeoutTime}. Expected a number.`)
            }
            if (timeoutTime <= 0) {
                i.reply({ content: "Invalid time format. Time must be greater than 0ms", flags: 64 })
                return
            }
            
            await membersObj.timeout(timeoutTime, timeoutReason)
                .catch(err => { throw new Error(`Failed to timeout user: ${membersObj.user.tag} ID: ${membersObj.id}. Error: ${err}`) });

            i.reply(message(i, membersObj))
            modlogschannel.send(modMessage(i, membersObj))
        }
    } catch (err) {
        throw new Error(`Failed to run function: ${err}`);
    }
}

module.exports = { timeout }