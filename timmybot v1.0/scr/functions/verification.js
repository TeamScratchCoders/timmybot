const fs = require('fs')
const { Client, Events, GatewayIntentBits } = require("discord.js")
const { token } = require('../../config.json')
const { log } = require('console')
const { role } = require('./role.js')
let verifiedMembers = JSON.parse(fs.readFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', 'utf8'))
client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

const verification = {
    checkUserPreVerification: async function(i) {
        verifiedMembers = JSON.parse(fs.readFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json'))
        console.log(verifiedMembers);
        try {
            if (verifiedMembers.members.includes(i.user.id)) {
                await client.users.fetch(i.user.id).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
            } else {
                await client.users.fetch(i.user.id).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
            }
            return false
        } catch (err) {
            if (err.message === 'Cannot send messages to this user') {
                if (verifiedMembers.members.includes(i.user.id)) {
                    console.log(false);
                    return false
                } else {
                    return true
                }
            } else {
                console.log(err);
            }
        }
    },
    ceckUserVerificationID: async (i) => {
        verifiedMembers = JSON.parse(fs.readFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json'))
        try {
            if (verifiedMembers.members.includes(i)) {
                await client.users.fetch(i).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
            } else {
                await client.users.fetch(i).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
            }
            return false
        } catch (err) {
            if (err.message === 'Cannot send messages to this user') {
                    return true
            } else {
                console.log(err);
            }
        }
    },
    verifyUser: async function(i) {
        try {
            if (verifiedMembers.members.includes(i.user.id)) {
                await client.users.fetch(i.user.id).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
            } else {
                await client.users.fetch(i.user.id).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
            }
            return false
        } catch (err) {
            if (err.message === 'Cannot send messages to this user') {
                if (!(verifiedMembers.members.includes(i.user.id))) {
                   try {
                        verifiedMembers.members.push(i.user.id)
                        fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify(verifiedMembers, null, 2))
                    } catch (err) {
                        console.log(err);
                    }
                }
                
                return true
            } else {
                console.log(err);
                return false
            }
        }
    },
    verifyUserByID: async (id) => {
        console.log(id);
        try {
            if (verifiedMembers.members.includes(id)) {
                await client.users.fetch(id).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
            } else {
                await client.users.fetch(id).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
            }
            return false
        } catch (err) {
            if (err.message === 'Cannot send messages to this user') {
                if (!(verifiedMembers.members.includes(id))) {
                   try {
                        verifiedMembers.members.push(id)
                        fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify(verifiedMembers, null, 2))
                    } catch (err) {
                        console.log(err);
                    }
                }
                
                return true
            } else {
                console.log(err);
                return false
            }
        }
    },
    removeUser: async (i) => {
        try {
            const removeMembers = verifiedMembers.members.filter(item => item !== i)

            await fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify({members: removeMembers}, null, 2))
        } catch (err) {
            console.log(err);
        }
    },
    scanUsers: async function() {
        verifiedMembers = JSON.parse(fs.readFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json'))
        try {
            for (let i2 = 1; i2 < verifiedMembers.members.length; i2++) {
                const e = verifiedMembers.members[i2]
                if (!(await verification.ceckUserVerificationID(e))) {

                    await verification.removeUser(e)

                    role.unverify(e)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}



module.exports = { verification }
client.login(token)