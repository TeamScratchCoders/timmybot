let browser
let page
let lastMessageTimestamp
let talking = false
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer')
const { aiChat, aiCookieValue, guildID, aiChannelID } = require('../../config.json')
const regex = /\boh my god|damn|shit|bastard|bitch|ass\b|cock\b|Blowjob|fuck|cunt|dick\b|fagget|faggot|feck\b|pussy|slut|nigga|nigger|prick|hell\b(?!o)|twat|whore\b/gi

function generatePersonality(person, message) {
    if (person === 'Ian R.') {
        return `Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: (your father. 15 years old.)${person}> "${message}"`
    } else if (person === 'Judah M.') {
        return `Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: (A large muscular Burly Ginger with 14 knives the size to kill a cougars and a beard all at age 16. Also your brother) ${person}> "${message}"`
    } else if (person === 'Tyler Y.') {
        return `Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: ${person}> "${message}"`
    } else {
        return `Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: ${person}> "${message}"`
    }
}

function censor(message) {
    if (!(regex.test(message))) {
        return message
    } else {
        return message.replace(regex, (match) => {
            console.log(match);
            return match[0] + '\\*'.repeat(match.length - 1)
        })
    }
}

function generateTime(unixTime) {
    let diff = Math.floor((Date.now() - unixTime) / 1000); // Convert diff to seconds
    let dateString = "";

    const times = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    const labels = ["year", "month", "week", "day", "hour", "minute", "second"];

    for (let i = 0; i < times.length; i++) {
        const timeValue = times[i];
        const count = Math.floor(diff / timeValue);

        if (count > 0) {
            const label = labels[i] + (count > 1 ? "s" : "");
            dateString += (dateString ? ", " : "") + `${count} ${label}`;
            diff -= count * timeValue;
        }
    }

    // Insert "and" before the last time unit only if dateString has multiple parts
    const lastCommaIndex = dateString.lastIndexOf(", ");
    if (lastCommaIndex !== -1) {
        dateString = dateString.slice(0, lastCommaIndex) + " and" + dateString.slice(lastCommaIndex + 1);
    }

    return dateString || "just now";
}

const ai = {
    start: async (i) => {
        try {
            browser = await puppeteer.launch({
                //executablePath: '/usr/bin/chromium',
                headless: true,
                args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
            })

            page = await browser.newPage()

            const cookie = {
                name: 'web-next-auth',
                value: aiCookieValue,
                domain: 'character.ai',
                path: '/',
                expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true
            }
    
            await page.setCookie(cookie)
    
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36')
    
            await page.goto(aiChat)

            if (i) {
                ai.connection(false)
            } else {
                ai.connection(true)
            }


        } catch (err) {
            console.log(err);
            return false
        }
    },
    connection: async (i) => {
        try {
            const guild = await client.guilds.fetch(guildID)
            const channel = await guild.channels.fetch(aiChannelID)

            const waitInLineElement  = await page.$('h2')
    
            const allText = await page.evaluate(el => el.innerText, waitInLineElement)
    
            const time  = parseInt(allText.match(/\d+/)[0], 10)

            if (i) {
                channel.send(`It appears Timmy about has been hit by a heavy load please wait the estimated ${time} minutes...`)
            }

            return false
        } catch (err) {
            try {
                await page.waitForSelector('p[node="[object Object]"]')
                return true
            } catch (err) {
                console.log(err);
                return false
            }
        }
    },
    msg: async (i, nickname) => {
        if (talking === false) {
            talking = true

            try {

                if (await ai.connection(true) === false) {
                    while (await ai.connection(false) === false) {
                        await delay(2000)
                    }
                }

                let mentions
                let filteredText
                const guild = await client.guilds.fetch(guildID)
                const channel = await guild.channels.fetch(aiChannelID)
                
                async function lastMessageNow() {

                    const element = await page.$('div.mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-2')

                    
                    const allText = await page.evaluate(el => {
                        return el.innerText;
                    }, element)

                    return allText
                }

                async function lastMessageFind() {
                    let lastMessagePast
                    let lastMessage = await lastMessageNow()
                    while (!(lastMessage === lastMessagePast)) {
                        lastMessagePast = lastMessage
                        await delay(1000)
                        await channel.sendTyping()
                        lastMessage = await lastMessageNow()
                    }

                    return lastMessage
                }

                function removeNewLines(e) {
                    return e.replace(/\r?\n|\r/g, '');
                }
    
                if (/<@!?(\d+)>/.test(i.content)) {
                    mentions = `${i.content}\s\s`.match(/<@!?(\d+)>/g)
                    filteredText = i.content.replace(mentions[0], `@${guild.members.cache.get(mentions[0].slice(2, -1)).nickname}`)
                } else {
                    filteredText = i.content
                }

                filteredText = await removeNewLines(filteredText)
                
                await page.type('.text-lg,.text-lg-chat', generatePersonality(nickname, filteredText) + `\n`)

                lastMessageTimestamp = Date.now()
                
                await page.waitForSelector('p[node="[object Object]"]')

                let whileLoopIndex = 1

                while (await lastMessageNow() == "" && whileLoopIndex <= 50) {
                    await delay(1000)

                    whileLoopIndex += 1

                    if (whileLoopIndex == 25) {
                        await channel.sendTyping()
                    }
                }

                if (whileLoopIndex >= 50) {
                    return "system error Timmy timed out please come back later. Estimated time 3 - 5 minutes"
                }

                await channel.sendTyping()

                lastMessageFindVariable = await lastMessageFind()

                if (/\b(Sometimes the AI generates a reply that doesn't meet our guidelines)/.test(lastMessageFindVariable)) {
                    talking = false
                    return false
                }
                
                talking = false

                console.log(censor(lastMessageFindVariable));

                return censor(lastMessageFindVariable)
            } catch (err) {
                console.log(err)
                talking = false
                return undefined
            }

        }
    },
    stop: async () => {
        try {
            await browser.close()
        } catch (err) {}
    },
    systemMsg: async (message) => {
        if (talking === false) {
            talking = true

            try {
                if (await ai.connection(false) === false) {
                    while (await ai.connection(false) === false) {
                        await delay(1000)
                    }
                }
                
                await page.type('.text-lg,.text-lg-chat', message + `\n`)

                talking = false
            } catch (err) {
                console.log(err)
                talking = false
            }

        }
    }
}

module.exports = { ai }