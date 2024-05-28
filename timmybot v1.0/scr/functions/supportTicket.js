const { webmasterRoleID } = require('../../config.json')

const supportTicket = {
    answer: (i) => {
        if (i.customId === 'b-001') {
            console.log('yes');
            supportTicket.openThread(i)
        }
    },
    openThread: async (i) => {
        const guild = await client.guilds.fetch('1223767535242055782')
        const channel = await guild.channels.fetch(i.channel.id)
        try {
            const thread = await channel.threads.create({
                name: 'Support Ticket',
                type: ChannelType.PrivateThread,
                reason: 'Needed a separate thread for food',
            });

            let membersWithRole = [...(i.guild.roles.cache.get(webmasterRoleID).members).keys()]

            console.log(membersWithRole)

            for (let i1 = 0; i1 < membersWithRole.length; i1++) {
                const e = membersWithRole[i1];
                thread.members.add(e)
            }

            thread.members.add(i.member.id)
            console.log(`Private thread created: ${thread.name} (ID: ${thread.id})`);
        } catch (error) {
            console.error('Error creating private thread:', error);
        }
    }
}

module.exports = { supportTicket }