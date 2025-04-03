const fs = require('fs')
const { role } = require('./role.js')
const { client } = require('../main.js')
const { EmbedBuilder } = require('discord.js');
const { guildID, moderatorLogsChannelID } = require('../../config.json');
const { error } = require('console');
const verifiedMembersPath = 'timmybot v1.0/assets/verification/verifiedMembers.json'

const verification = {
    checkUserSecurity: async (memberID) => {
        if ((!/^\d{18,19}$/.test(memberID))) {throw new Error("Invalid memberID")}
        if (typeof memberID !== "string") {throw new TypeError("parameter for checkUserSecurity must be a string")}

        const guild = await client.guilds.fetch(guildID)
        const member = await guild.members.fetch(memberID)
        const result = await member.send("If you are seeing this than that is not good. Go back to the server to get further instructions.")
            .then(() => false)
            .catch((e) => e.rawError.code === 50007)

        return result
    },
    getUserVerification: (memberID) => {
        if ((!/^\d{18,19}$/.test(memberID))) {throw new Error("Invalid memberID")}
        if (typeof memberID !== "string") {throw new TypeError("parameter for getUserVerification must be a string")}

        const verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8')).members
        return verifiedMembers.includes(memberID)
    },
    verifyUser: (memberID) => {
        if ((!/^\d{18,19}$/.test(memberID))) {throw new Error("Invalid memberID")}
        if (typeof memberID !== "string") {throw new TypeError("parameter for verifyUser must be a string")}

        const verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8')).members
        if (verifiedMembers.includes(memberID)) {
            return
        }
        verifiedMembers.push(memberID)
        fs.writeFileSync(verifiedMembersPath, JSON.stringify({members: verifiedMembers}))
    },
    unverifyUser: (memberID) => {
        if ((!/^\d{18,19}$/.test(memberID))) {throw new Error("Invalid memberID")}
        if (typeof memberID !== "string") {throw new TypeError("parameter for unverifyUser must be a string")}

        if (fs.existsSync(`timmybot v1.0/assets/users/profile/${memberID}.json`)) {
            fs.unlinkSync(`timmybot v1.0/assets/users/profile/${memberID}.json`)
        }
        const verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8'))
        const removeMembers = verifiedMembers.members.filter(item => item !== memberID)
        fs.writeFileSync(verifiedMembersPath, JSON.stringify({members: removeMembers}))
    },
    scanUser: async (memberID) => {
        if ((!/^\d{18,19}$/.test(memberID))) {throw new Error("Invalid memberID")}
        if (typeof memberID !== "string") {throw new TypeError("parameter for scanUser must be a string")}

        verification.checkUserSecurity(memberID)
            .then((result) => {
                if (!result) {
                    verification.unverifyUser(memberID)
                }
            })
            .catch((error) => error(error))
    },
    scanUsers: async (memberIDs = false) => {
        const guild = await client.guilds.fetch(guildID)
        const moderatorLogsChannel = await guild.channels.fetch(moderatorLogsChannelID)
        if (memberIDs == false) {
            const verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8')).members
            memberIDs = verifiedMembers
        }
        memberIDs.forEach(ID => {
            verification.scanUser(ID)
        });
    }
}

module.exports = { verification }