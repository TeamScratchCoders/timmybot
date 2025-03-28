const { GuildMember } = require('discord.js')
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
                    console.log("No profile found");
                    return undefined
                }
                const profile = JSON.parse(fs.readFileSync(path + member.id + ".json", 'utf8'))
                return profile
            } else if (typeof member === 'string') {
                if (!fs.existsSync(path + member + ".json")) {
                    console.log("No profile found");
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
    }
}

module.exports = { profile }