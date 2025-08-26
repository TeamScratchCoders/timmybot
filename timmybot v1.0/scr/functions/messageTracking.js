const {profile} = require('./profile.js')
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


function level(currentXP, baseXP = 100) {
    let count = 0;
    let subtract = baseXP;
    while (currentXP >= subtract) {
        subtract += baseXP * Math.log(count + 1);
        count++;
    }
    return count
}

function didLevel(currentXP) {
    let lastXP = level(currentXP - 1);
    return level(currentXP) !== lastXP
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

        const memberProfile = await profile.get(i.author.id)
        await fs.writeFileSync(`timmybot v1.0/assets/users/message/${i.author.id}.json`, JSON.stringify(usermessage, null, 2))

        if (memberProfile == undefined) {
            return
        }

        if (didLevel(memberProfile.messages)) {
            await i.reply({ content: `You have leveled up to level ${level(memberProfile.messages)} :partying_face:`, flags: 64 })
        }

        await profile.setMessages(i.author.id)
    } catch (err) {
        console.log(err)
    }
}

module.exports = { messageTracking }