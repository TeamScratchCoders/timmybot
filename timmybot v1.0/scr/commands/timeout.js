const path = require('path')
const { guildID, moderatorLogsChannelID } = require('../../config.json');
const { EmbedBuilder } = require('@discordjs/builders');

/**
 * Times out user and sends message to moderator logs and the channel where the user was timed out in.
 * @param {import('discord.js').CommandInteraction} i
 * @throws {TypeError}
 * @throws {Error}
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

            const videoPath = path.join(__dirname, '../../assets/video/you_reached_your_limit_on_talking.mp4')
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
                .setDescription(`# <@${CommandInteraction.user.id}> Timed out <@${membersObj.id}>\n### Reason: "${CommandInteraction.options._hoistedOptions[2]?.value || 'No reason stated.'}"\n### Duration: ${CommandInteraction.options._hoistedOptions[1].value} minute${CommandInteraction.options._hoistedOptions[1].value > 1 ? "s" : ""}`)
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

        const guild = await client.guilds.cache.get(guildID)
        const modlogschannel = await guild.channels.fetch(moderatorLogsChannelID)
        const membersObj = await guild.members.fetch(i.options._hoistedOptions[0].user.id)

        let hasAdministrator

        try { hasAdministrator = (membersObj.permissions.has('ADMINISTRATOR')) } catch (e) { hasAdministrator = false }

        if (hasAdministrator) {
            i.reply({ content: "User has Administrator permissions. You cant time him out asshole.", flags: 64 })
        } else {
            const timeoutTime = i.options._hoistedOptions[1].value * 60000
            const timeoutReason = i.options._hoistedOptions.length > 2 ? `${i.member.nickname} Timed you out: ${i.options._hoistedOptions[2].value}` : `${i.member.nickname} Timed you out: no reason provided`
            await membersObj.timeout(timeoutTime, timeoutReason)
                .catch(console.error);
            
            i.reply(message(i, membersObj))
            modlogschannel.send(modMessage(i, membersObj))
        }
    } catch (err) {
        throw new Error(`Failed to run function: ${err}`);
    }
}

module.exports = { timeout }