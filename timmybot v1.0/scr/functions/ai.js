let browser
let aiText
let aiImage
let lastMessageTimestamp
let talking = false
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const axios = require('axios')
const fs = require('fs')
const { aiChat, aiCookieValue, guildID, aiChannelID } = require('../../config.json')
const { supervisor } = require('../../../supervisor')
const regex = /\bfucker|damn|shit|bastard|bitch|ass\b|cock\b|Blowjob|fuck|cunt|dick\b|fagget|faggot|feck\b|pussy|slut|nigga|nigger|prick|hell\b(?!o)|twat|whore\b/gi

//* Functions:
function generatePersonality(person, message, imageDescription) {
    if (person === 'Ian R.') {
        return `Image: ${imageDescription}. Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: (your father. 15 years old.)${person}> "${message}"`
    } else if (person === 'Judah M.') {
        return `Image: ${imageDescription}. Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: (A large muscular Burly Ginger with 14 knives the size to kill a cougars and a beard all at age 16. Also your brother) ${person}> "${message}"`
    } else if (person === 'Tyler Y.') {
        return `Image: ${imageDescription}. Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: ${person}> "${message}"`
    } else if (person === 'Jake H.') {
        return `Image: ${imageDescription}. Last message you received was ${generateTime(lastMessageTimestamp)} ago, (the man how feed you 100,000,000,000,000,000,000,000,000,000,000 everyday for Easter and Christmas) new message: ${person}> "${message}"`
    } else {
        return `Image: ${imageDescription}. Last message you received was ${generateTime(lastMessageTimestamp)} ago, new message: ${person}> "${message}"`
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

//* Functionality:

const ai = {
    start: async (i) => {
        /*This function starts up a headless Puppeteer function and web scrapes the website character.ai.
        On the website is a large language model that is designed to represent Timmy.
        The Puppeteer instance logs into the character.ai account by injecting a cookie with the login token*/
            browser = await puppeteer.launch({
                //executablePath: '/usr/bin/chromium',
                headless: true,
                args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
            })
        supervisor.succeed("AI browser instance started")

        aiText = await browser.newPage()
        supervisor.succeed("aiText instance started")

        aiImage = await browser.newPage()
        supervisor.succeed("aiImage instance started")

            const cookie = {
                name: 'web-next-auth',
                value: aiCookieValue,
                domain: 'character.ai',
                path: '/',
                expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true
            }
    
        //* aiText

        await aiText.setCookie(cookie)
        supervisor.succeed("Cookie successfully injected for aiText")
    
        await aiText.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36')
        supervisor.succeed("Successfully set user argument for aiText")
    
        await aiText.goto(aiChat)
        supervisor.succeed("Requested AI website for aiText")

            if (i) {
                ai.connection(false)
            } else {
                ai.connection(true)
            }

        //* aiImage

        await aiImage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36')
        supervisor.succeed("Successfully set user argument for aiText")

        await aiImage.goto('https://imagecaptiongenerator.com/')
        supervisor.succeed("Requested AI website for aiText")
    },
    connection: async (i) => {
        /*This function checks the availability of the website.*/

        try {
            const guild = await client.guilds.fetch(guildID)
            const channel = await guild.channels.fetch(aiChannelID)

            const waitInLineElement = await aiText.$('h2')
    
            const allText = await aiText.evaluate(el => el.innerText, waitInLineElement)
    
            const time = parseInt(allText.match(/\d+/)[0], 10)

            if (i) {
                channel.send(`It appears Timmy about has been hit by a heavy load please wait the estimated ${time} minutes...`)
            }

            return false
        } catch (err) {
            try {
                await aiText.waitForSelector('p[node="[object Object]"]')
                return true
            } catch (err) {
                console.log(err);
                return false
            }
        }
    },
    msg: async (i, nickname, imageUrl) => {
        /*This function emulates a keyboard through Puppeteer and types in a prompt to the AI and reads it back.*/

        if (talking === false) {
            talking = true

            try {
                let imageDescription
                let mentions
                let filteredText
                const guild = await client.guilds.fetch(guildID)
                const channel = await guild.channels.fetch(aiChannelID)
                
                async function lastMessageNow() {

                    const element = await aiText.$('div.mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-2')

                    
                    const allText = await aiText.evaluate(el => {
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
    

                if (await ai.connection(true) === false) {
                    while (await ai.connection(false) === false) {
                        await delay(2000)
                    }
                }

                if (/<@!?(\d+)>/.test(i.content)) {
                    mentions = `${i.content}\s\s`.match(/<@!?(\d+)>/g)
                    filteredText = i.content.replace(mentions[0], `@${guild.members.cache.get(mentions[0].slice(2, -1)).nickname}`)
                } else {
                    filteredText = i.content
                }

                filteredText = await removeNewLines(filteredText)
                
                if (imageUrl.length > 0) {
                    imageDescription = `${nickname} sent you an image.`;

                    for (const [i, e] of imageUrl.entries()) {
                        const description = await ai.describeImage(e);

                        imageDescription = `${imageDescription}, image number ${i + 1} can be best described as: "${description}"`;
                    }

                    imageDescription += ".";
                } else {
                    imageDescription = "No images were sent";
                }

                await aiText.type('.text-lg,.text-lg-chat', generatePersonality(nickname, filteredText, imageDescription) + `\n`)

                lastMessageTimestamp = Date.now()
                
                await aiText.waitForSelector('p[node="[object Object]"]')

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

                return censor(lastMessageFindVariable)
            } catch (err) {
                console.log(err)
                talking = false
                return undefined
            }

        }
    },
    stop: async () => {
        /*This function closes the Puppeteer instance*/

        try {
            await browser.close()
        } catch (err) { }
    },
    systemMsg: async (message) => {
        /*This function sends a message without any of the boilerplate*/

        if (talking === false) {
            talking = true

            try {
                if (await ai.connection(false) === false) {
                    while (await ai.connection(false) === false) {
                        await delay(1000)
                    }
                }
                
                await aiText.type('.text-lg,.text-lg-chat', message + `\n`)

                talking = false
            } catch (err) {
                console.log(err)
                talking = false
            }

        }
    },
    describeImage: async (url) => {
        try {

            await aiImage.reload()

            const response = await axios.get(url, { responseType: 'arraybuffer' })

            fs.writeFileSync('timmybot v1.0/assets/temp/functionAIDescribeImageTempImage.jpg', response.data)

            await aiImage.waitForSelector('input');

            const input = await aiImage.$('input');

            await input.uploadFile('timmybot v1.0/assets/temp/functionAIDescribeImageTempImage.jpg');

            await aiImage.select('select#tone', 'accurate');

            await aiImage.waitForSelector('button');

            await aiImage.click('button');

            await aiImage.waitForSelector('[class="rounded-lg text-lg bg-white dark:bg-gray-900 p-4 my-2 flex flex-col gap-1 mt-4 border border-gray-200 dark:border-gray-700"]');

            const divElements = await aiImage.$$('[class="rounded-lg text-lg bg-white dark:bg-gray-900 p-4 my-2 flex flex-col gap-1 mt-4 border border-gray-200 dark:border-gray-700"]');

            const allText = await Promise.all(
                divElements.map(async (div) => {
                    const text = await div.evaluate(el => el.innerText);
                    return text.replace(/\n?Copy/g, '').trim();
                })
            );

            return allText;
        } catch (err) {
            console.log(err);
        }

    }
}

module.exports = { ai }