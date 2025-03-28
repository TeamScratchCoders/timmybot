let browser
let aiText
let aiImage
let lastMsgTimestamp
let talking = false
let msgAccumulator = []
let msgTimer = 0

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const axios = require('axios')
const fs = require('fs')
const { profile } = require('./profile.js')
const { aiChat, aiCookieValue, guildID, aiChannelID } = require('../../config.json')
const { supervisor } = require('../../../supervisor')
const regex = /\bfucker|damn|shit|bastard|bitch|cock\b|Blowjob|fuck|cunt|dick\b|fagget|faggot|feck\b|pussy|slut|nigga|nigger|prick|hell\b(?!o)|twat|whore\b/gi

//* Functions:
function censor(msg) {
    if (!(regex.test(msg))) {
        return msg
    } else {
        return msg.replace(regex, (match) => {
            console.log(match);
            return match[0] + '\\*'.repeat(match.length - 1)
        })
    }
}

//* Functions: This function is used to generate the time since the last msg
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
    start: async (i) => { //*This establishes a puppeteer connection
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
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
        //*This function checks the availability of the website.

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
        //*Dysfunction communicates with the AI on behalf of Discord users. This allows for prompt engineering.
        async function checkResponseStatus() {
            const buttonSelector = 'button[aria-label="Send a message..."].pointer-events-none';

            const button = await aiText.waitForSelector(buttonSelector, { timeout: 5000 }).catch(() => null);
            if (!button) {
                console.error(`Button with selector ${buttonSelector} not found.`);
                return false;
            }

            const svgPathHandle = await button.$('div svg path');
            if (!svgPathHandle) {
                console.error("SVG path element not found inside the button.");
                return false;
            }

            const pathD = await aiText.evaluate(el => el.getAttribute('d'), svgPathHandle);

            const expectedPath = 'M3.113 6.178C2.448 4.073 4.64 2.202 6.615 3.19l13.149 6.575c1.842.921 1.842 3.55 0 4.472l-13.15 6.575c-1.974.987-4.166-.884-3.501-2.99L4.635 13H9a1 1 0 1 0 0-2H4.635z';

            const isMatching = pathD === expectedPath;

            return isMatching;
        }

        async function getlastMsg() {
            const element = await aiText.$('div.mt-1.max-w-xl.rounded-2xl.px-3.min-h-12.flex.justify-center.py-3.bg-surface-elevation-2')

            const allText = await aiText.evaluate(el => {
                return el.innerText;
            }, element)

            return (await allText);
        }

        function prompt(msgList, lastMsgTimestamp, age) {
            /**
             * Generates a string of messages condensed.
             * @param {Array<{ nickname: string, content: string, image: boolean, imageDescription: string}>} msgList - List of messages objs
             * @returns {Array<{ nickname: string, content: string, image: boolean, imageDescription: string}>} - List of messages that have been condensed objs
             * @throws {Error} - If the parameter of the function is not a string
             */
            function condense(msgList) {
                if (typeof msgList !== 'object') {
                    throw new TypeError('Parameter of the function "condense" must be a Array.');
                }
                try {
                    let condensedList = []
                    msgList.forEach((msg) => {
                        const lastMsg = condensedList[condensedList.length - 1]
                        if (lastMsg && lastMsg.nickname == msg.nickname) {
                            lastMsg.content += " " + msg.content;
                        } else {
                            condensedList.push(msg)
                        }
                    })
                    return condensedList
                } catch (err) {
                    console.log(`Failed to run function: ${err}`);
                    throw new Error(`Failed to run function: ${err}`);
                }
            }

            let prompt = `Time: ${new Date().toLocaleTimeString()}, Date: ${new Date().toLocaleDateString()}, Last Message Received: ${generateTime(lastMsgTimestamp)}, `

            console.log(prompt);
            

            condense(msgList).forEach((msg) => {
                const image = msg.image ? `, *${msg.nickname} Sent an image: ${msg.imageDescription}*` : ''
                prompt += `(${msg.nickname} | Age: ${age}): "${msg.content}"${image} `
            })

            return prompt
        }

        function getAge(profile) {
            const today = Math.floor(new Date().getTime() / 1000);
            const age = Math.floor((today - profile.birthDay) / 31557600);
            return age
        }
        
        if (imageUrl.length > 0) {            
            imageUrl.forEach(async(image) => {
                msgAccumulator.push({ nickname: nickname, content: i.content, image: true, imageDescription: await ai.describeImage(image) })  
            })
        } else {
            msgAccumulator.push({ nickname: nickname, content: i.content, image: false, imageDescription: null })
        }

        msgTimer = 3000

        if (!talking) {
            while (msgTimer > 0) {
                talking = true
                if (msgTimer > 100) {
                    await delay(100)
                    msgTimer -= 100
                } else {
                    await delay(msgTimer)
                    msgTimer = 0
                }
                console.log("msgTimer Time left: " + msgTimer);
            }

            talking = false

            await aiText.type('.text-lg,.text-lg-chat', `${prompt(msgAccumulator, lastMsgTimestamp, getAge(await profile.get(i.author.id)))}\n`)

            msgAccumulator = []

            while (await checkResponseStatus() == false) {
                await delay(100)
            }

            while (await checkResponseStatus() == true) {
                await delay(100)
            }

            await delay(1000)

            const output = await getlastMsg()

            console.log(output);
            

            lastMsgTimestamp = Math.floor(Date.now() / 1000)
            return output
        }

        return null
    },
    stop: async () => {
        /*This function closes the Puppeteer instance*/

        try {
            await browser.close()
        } catch (err) { }
    },
    systemMsg: async (msg) => {
        /*This function sends a msg without any of the boilerplate*/

        if (talking === false) {
            talking = true

            try {
                if (await ai.connection(false) === false) {
                    while (await ai.connection(false) === false) {
                        await delay(1000)
                    }
                }

                await aiText.type('.text-lg,.text-lg-chat', msg + `\n`)

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

    },
    setTimer: (time) => {
        msgTimer = time
    }
}

module.exports = { ai }