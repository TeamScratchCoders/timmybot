const ping = (i) => {
    console.log('ping')
    i.reply({content: "ping", flags: 64 })
}

module.exports = { ping }