const { madlibs } = require('../../assets/madlibs/madlibs.json')
let madlibProgress = []
let madlibsinputObj

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateMadlib(inputObj) {
    let madlibObj = {
        content: "",
        embeds: [
            {
                description: `# ${madlibs[madlibsinputObj].title} - Mad Lib\n*Reply to this message to fill out this sheet.*`,
                color: 1905241
            }
        ]
    }

    let madlibAnswer = {
        embeds: [
            {
                description: `# ${madlibs[madlibsinputObj].title}\n\n${madlibs[madlibsinputObj].answer}`,
                color: 1905241
            }
        ]
    }
    
    for (let i = 0; i < madlibs[madlibsinputObj].words.length; i++) {
        const e = madlibs[madlibsinputObj].words[i];
        if (i == inputObj.length) {
            madlibObj.embeds[0].description += `\n### > ${e}: ||blink||`
        } else if (i < inputObj.length) {
            madlibObj.embeds[0].description += `\n### ${e}: \`${inputObj[i]}\``
        } else if (i > inputObj.length) {
            madlibObj.embeds[0].description += `\n### ${e}: ||blink||`
        }
    }

    console.log(madlibs[madlibsinputObj].title.length);
    console.log(inputObj.length);



    if (madlibs[madlibsinputObj].words.length == inputObj.length) {

        madlibAnswer = JSON.stringify(madlibAnswer)

        madlibAnswer = madlibAnswer.replace(/\[(\d+)\]/g, (match, i1) => {
            const arrayinputObj = parseInt(i1) - 1;
            return inputObj[arrayinputObj] || match;
        })

        return JSON.parse(madlibAnswer)
    }

    return madlibObj
}

const madlibFunc = {
    newStart: async (i) => {
        madlibsinputObj = getRandomNumber(0, (madlibs.length - 1))
        madlibProgress = []
        i.reply(generateMadlib(madlibProgress))
    },
    generateResponse: async (i) => {
        i.reply(generateMadlib(madlibProgress))
    },
    addWord: async (i) => {
        i.delete()
        const fetchedMessage = await i.channel.messages.fetch(i.reference.messageId)
        madlibProgress.push(i.content)
        fetchedMessage.edit(generateMadlib(madlibProgress))
    }
}

module.exports = { madlibFunc }