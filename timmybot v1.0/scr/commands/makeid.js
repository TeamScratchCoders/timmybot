const puppeteer = require('puppeteer-extra')
const axios = require('axios')
const fs = require('fs');
const { AttachmentBuilder } = require('discord.js')

const makeid = async (i) => {
    function checkInput(input) {
        const regexDate = /^[0-9]{2}[^0-9][0-9]{2}[^0-9][0-9]{4}$/
        const regexWord = /[a-z]+/i

        const list = [
            [input[0], regexWord, "first name"],
            [input[1], regexWord, "last name"],
            [input[2], regexDate, "birth date"],
            [input[3], regexWord, "position"],
            [input[4], regexDate, "position start date"],
            [input[5], regexWord, "rank"],
            [input[6], regexWord, "patrol"],
            [input[7], regexDate, "issued date"],
            [input[9], regexDate, "position end date"],
            [input[10], regexDate, "expiration date"],
        ]

        let InvalidResponses = []

        list.forEach(item => {
            if (item[0] != undefined && !item[1].test(item[0])) {
                InvalidResponses.push(item[2])
            }
        })

        if (InvalidResponses.length <= 0) {
            return true
        }

        return InvalidResponses
    }

    function makeInvalidMessage() {
        const invaledInputsList = checkInput(inputs)

        let invalidMessageAccumulator = ""

        if (invaledInputsList !== true) {
            invaledInputsList.forEach(item => {
                invalidMessageAccumulator += (`\n\`Invalid: ${item}\``)
            })
            i.reply({ content: `The command is inproperly formatted. ${invalidMessageAccumulator}`, flags: 64 })
            return false
        }

        if (positionEndDate == undefined) {
            positionEndDate = processOptionals(positionStartDate)
        }
        if (expirationDate == undefined) {
            expirationDate = processOptionals(issuedDate)
        }

        return true
    }

    function processOptionals(date) {
        const startDate = new Date(date)
        const endDate = new Date(startDate.setMonth(startDate.getMonth() + 6))

        const month = (endDate.getMonth() + 1).toString().padStart(2, "0")
        const day = endDate.getDate().toString().padStart(2, "0")
        const year = endDate.getFullYear()

        return `${month}/${day}/${year}`
    }

    async function downloadImage(url, destination) {
        const writer = fs.createWriteStream(destination);

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    async function makeCard() {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            headless: true,
            args: ['--allow-file-access-from-files']
        });
        const page = await browser.newPage();
        
        await page.setViewport({
            width: 2100,
            height: 1200,
        });
        
        await page.goto('file://' + process.cwd() + '/timmybot v1.0/assets/membershipcard/index.html');
        await page.evaluate((rank, patrol, lastName, firstName, issuedDate, expirationDate, position, positionStartDate, positionEndDate, birthDate) => {
            const lists = [
                { id: 'rank', text: rank },
                { id: 'patrol', text: patrol },
                { id: 'lastName', text: lastName },
                { id: 'firstName', text: firstName },
                { id: 'issued', text: issuedDate },
                { id: 'expires', text: expirationDate },
                { id: 'position', text: position },
                { id: 'positionStart', text: positionStartDate },
                { id: 'positionEnd', text: positionEndDate },
                { id: 'signature', text: firstName + ' ' + lastName },
                { id: 'birthDay', text: birthDate },
                { id: 'birthDay', text: birthDate },
            ];
            
            lists.forEach(lists => {
                const element = document.querySelectorAll(`#${lists.id}`);
                element.forEach(element => {
                    element.textContent = lists.text;
                });
            });
        }, rank, patrol, lastName, firstName, issuedDate, expirationDate, position, positionStartDate, positionEndDate, birthDate);
        
        await page.screenshot({ path: process.cwd() + '/timmybot v1.0/assets/membershipcard/output.png' });
        
        await browser.close();
    }
    
    const inputs = i.options._hoistedOptions.map(option => option.value);
    let [
        firstName,
        lastName,
        birthDate,
        position,
        positionStartDate,
        rank,
        patrol,
        issuedDate,
        photo,
        positionEndDate,
        expirationDate
    ] = inputs;
    
    photo = i.options._hoistedOptions[8].attachment.url
    
    if (!makeInvalidMessage()) {
        return
    }
    
    await downloadImage(photo, process.cwd() + '/timmybot v1.0/assets/membershipcard/portrait.png')
    
    await i.deferReply({ flags: 64 })

    await makeCard()
    
    await i.editReply({ files: [new AttachmentBuilder(process.cwd() + '/timmybot v1.0/assets/membershipcard/output.png')] });
}

module.exports = { makeid }