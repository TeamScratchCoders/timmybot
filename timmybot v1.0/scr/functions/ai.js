let browser
let page
let talking = false
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer-core')
const { aiChat, aiCookieValue, guildID, aiChannelID } = require('../../config.json')

function generatePersonality(person, message) {
    if (person === 'Ian R.') {
        return `*Timmy instinctually writes everything in one line* (your father)${person}> "${message}"`
    } else if (person === 'Judah M.') {
        return `*Timmy instinctually writes everything in one line* (A large muscular Burly Ginger with 14 knives the size to kill a cougars and a beard all at age 16. Also your brother) ${person}> "${message}"`
    } else if (person === 'Tyler Y.') {
        return `*Timmy instinctually writes everything in one line* ${person}> "${message}"`
    } else {
        return `*Timmy instinctually writes everything in one line* ${person}> "${message}"`
    }
}


const ai = {
    start: async () => {
        try {
            browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium',
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
    
            await page.waitForSelector('.text-lg, .text-lg-chat')

            return true

        } catch (err) {
            console.log(err);
            return false
        }
    },
    msg: async (i, nickname) => {
        if (talking === false) {
            talking = true

            try {
                let mentions
                let filteredText
                const guild = await client.guilds.fetch(guildID)
                const channel = await guild.channels.fetch(aiChannelID)
                
                async function lastMessageNow() {

                    const element = await page.$$('p[node="[object Object]"]')
                    
                    const messag = await page.evaluate(el => el.textContent, element[0])

                    return messag
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
                
                await page.waitForSelector('p[node="[object Object]"]')

                await delay(2000)

                while (/.*> ".*"$/.test(lastMessageNow())) {
                    await delay(500)
                }

                await channel.sendTyping()

                lastMessageFindVariable = await lastMessageFind()
                
                talking = false

                return lastMessageFindVariable
            } catch (err) {
                console.log(err)
                talking = false
                return false
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
                const guild = await client.guilds.fetch(guildID)
                const channel = await guild.channels.fetch(aiChannelID)
                
                await page.type('.text-lg,.text-lg-chat', message + `\n`)
                
                await page.waitForSelector('p[node="[object Object]"]')

                await delay(2000)

                await channel.sendTyping()
            } catch (err) {
                console.log(err)
                talking = false
            }

        }
    }
}

module.exports = { ai }