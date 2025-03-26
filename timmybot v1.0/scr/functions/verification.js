const fs = require('fs')
const { role } = require('./role.js')
const { client } = require('../main.js')
const { GuildMember, EmbedBuilder } = require('discord.js');
const { guildID, moderatorLogsChannelID } = require('../../config.json');
const verifiedMembersPath = 'timmybot v1.0/assets/verirfication/verifiedMembers.json'
let verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8'))

const verification = {
    /**
     * This function adds a user to the list of verified users.
     * @param {import('discord.js').GuildMember} member - The guild member object
     * @throws {Error} If the fs falles to wright.
     */
    verifyUser: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        if (!verifiedMembers.members.includes(memberObj.id)) {
            verifiedMembers.members.push(memberObj.id)
            try {
                fs.writeFileSync(verifiedMembersPath, JSON.stringify(verifiedMembers))
            } catch (err) {
                throw new Error(`Faled to write to verifiedMembers.json. Error: ${err}`)
            }
        }
    },
    /**
     * This function removes a user from the list of verified users.
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @throws {Error} If the fs falles to wright.
     */
    unverifyUser: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        const removeMembers = verifiedMembers.members.filter(item => item !== memberObj.id)
        verifiedMembers.members = removeMembers;
        try {
            fs.writeFileSync(verifiedMembersPath, JSON.stringify({ members: removeMembers }, null, 2))
        } catch (err) {
            throw new Error(`Faled to write to verifiedMembers.json. Error: ${err}`)
        }
    },
    /**
     * This function checks if a user is verified or not
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @returns {boolean} If the user is verified or not
     * @throws {Error} If the memberObj is not a GuildMember object
     */
    getUserVerification: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        return verifiedMembers.members.includes(memberObj.id)
    },
    /**
     * Checks if a user can be direct messaged. If the user is able to be direct messaged, then it will return false. If the user is unable to be direct messaged, then it will return true. If the check fails, then it will throw an error.
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @returns {boolean} `True` if The user has passed the check
     * @throws {Error} If the check fails
     */
    checkUserSecurity: async (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        let secure
        await memberObj.send("If you are seeing this than that is not good. Go back to the server to get further instructions.")
            .then(secure = false)
            .catch((e) => e.rawError.code === 50007 ? secure = true : secure = null)

        if (secure == null) {
            throw new Error("Failed to run checkUserSecurity function, no information available")
        }
        return secure
    },
    /**
     * This function will go through all the verified users and check if they still have DMs disabled. If they don't, then it will unverify them and send a message to the moderator logs channel.
     * @throws {Error} If the function fails to write to verifiedMembers.json
     */
    scanUsers: async () => {
        async function unverify(member, cannnel) {
            try {
                verification.unverifyUser(member)
                role.unverify(member)

                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setAuthor({
                        name: `${member.nickname}`,
                        iconURL: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp?size=128`
                    })
                    .setTitle('A User has been Unverified.')
                    .setDescription(`<@${member.user.id}> has been unverified.`)
                    .setTimestamp()

                cannnel.send({ embeds: [embed] })
            } catch (err) {
                throw new Error(`Faled to write to verifiedMembers.json. Error: ${err}`)
            }
        }
        const guild = await client.guilds.fetch(guildID)
        const modCannnel = await guild.channels.fetch(moderatorLogsChannelID)

        await verifiedMembers.members.forEach(async (member) => {
            try {
                const memberObj = await guild.members.fetch(member)

                if (!(await verification.checkUserSecurity(memberObj))) {
                    unverify(memberObj, modCannnel)
                }
            } catch (err) {
                console.error(err)
                modCannnel.send({ content: `\`Failed to scan ${member}. Error: ${err}\`` })
            }
        })
    }
}

module.exports = { verification }