const fs = require('fs')
const { guildID } = require('../../config.json');
const path = require('path');
const rolePath = "timmybot v1.0/assets/users/roles/"

const role = {
    unverify: async (id) => {
        try {
            const guild = await client.guilds.fetch(guildID);
            const member = await guild.members.fetch(id);

            const roles = member.roles.cache;
            for (const [roleId, role] of roles) {
                await member.roles.remove(role)
                console.log(`Removed role ${role.name} from user ${member.user.tag}`)
            }
        } catch (error) {
            console.error(`Error removing roles from user with ID ${id}:`)
        }
    },
    updateUsersRole: (currentMemberStatus) => {
        const usersRoles = JSON.parse(fs.readFileSync(`${rolePath}/${currentMemberStatus.user.id}.json`, 'utf8'))
    }
}

module.exports = { role }