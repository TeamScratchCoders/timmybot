const massdelete = async (i) => {
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