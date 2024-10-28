const massdelete = async (i) => {
    try {await !(i.guild.members.cache.get(i.user.id).permissions.has('ADMINISTRATOR'))} catch (e) {i.reply({content: "You are not allowed to use this command.", flags: 64 });return}//* stops program if user does not have administrative privileges.
    const channel = i.channel
    const messagesToDelete = await channel.messages.fetch({ limit: 100 })
    try {
        await channel.bulkDelete(messagesToDelete)
        i.reply({content: "Successfully deleted messages", flags: 64 })
    } catch (err) {
        console.log(err);
        i.reply({content: "can't delete messages that are older than 14 days", flags: 64 })
    }
}

module.exports = { massdelete }