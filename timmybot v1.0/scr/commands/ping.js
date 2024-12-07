const ping = (i) => {
    console.log('pong!')
    i.reply({content: "pong!", flags: 64 })
}

module.exports = { ping }