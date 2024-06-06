const fs = require('fs')
const example = {
    user: {
        id: "123456789012345678",
        username: "example",
        nickname: "Example"
    },
    messages: {
    }
}

function generateExample(id, username, nickname) {
    return {
        user: {
            id: `${id}`,
            username: `${username}`,
            nickname: `${nickname}`
        },
        messages: {
        }
    }
}

const messageTracking = async (i) => {
    try {
        let usermessage
        try {
            usermessage = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/users/message/${i.author.id}.json`, 'utf8'))
        } catch (err) {
            const member = i.guild.members.cache.get(i.author.id)
            usermessage = generateExample(i.author.id, i.author.username, member.nickname)
        }

        usermessage.messages[i.createdTimestamp] = {
            id: `${i.id}`, 
            channelId: `${i.channelId}`, 
            createdTimestamp: i.createdTimestamp, 
            content: `${i.content}`
        }

        await fs.writeFileSync(`timmybot v1.0/assets/users/message/${i.author.id}.json`, JSON.stringify(usermessage, null, 2))
    } catch (err) {
        console.log(err)
    }
}

module.exports = { messageTracking }