const { youthRoleID, adultRoleID } = require('../../config.json');
const { GuildMember } = require('discord.js');

const role = {
    /**
     * Removes the youth and adult roles from a user. If the user is not a GuildMember object, then a TypeError is thrown. If the youthRoleID or adultRoleID in config.json is not a valid role ID, then a TypeError is thrown.
     * @param {import('discord.js').GuildMember} memberOBJ - The guild member object
     * @throws {TypeError} If the memberObj is not a GuildMember object
     * @throws {TypeError} If the youthRoleID or adultRoleID in config.json is not a valid role ID
     * @throws {Error} If an error occurs while removing the roles
     */
    unverify: async (memberOBJ) => {
        try {
            const youthRole = memberOBJ.guild.roles.cache.get(youthRoleID)
            const adultRole = memberOBJ.guild.roles.cache.get(adultRoleID)

            if (!(memberOBJ instanceof GuildMember)) {
                throw new TypeError(`Expected memberObj to be a GuildMember object. Received: ${typeof memberOBJ}`);
            }

            if (!youthRole) {
                throw new TypeError(`youthRoleID form config.json is not a valid role ID. (ID: ${youthRoleID})`);
            } else if (!adultRole) {
                throw new TypeError(`adultRoleID form config.json is not a valid role ID. (ID: ${adultRoleID})`);
            }

            await memberOBJ.roles.remove(youthRoleID)
            await memberOBJ.roles.remove(adultRoleID)
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}

module.exports = { role }