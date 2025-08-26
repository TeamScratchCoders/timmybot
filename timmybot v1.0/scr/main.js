//* gets all modules
const { supervisor } = require('../../supervisor.js');
const chalk = require('chalk');
const { Client, GatewayIntentBits, Events } = require("discord.js")
const { token, guildID, verificationChannelID, ruleChannelID, supportChannelID, aiChannelID, botCommandChannelID } = require('../config.json');
const { log } = require('console');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping
    ]
})


function imageToUrl(i) {
    try {
        return [
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/png').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/jpeg').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/webp').map(att => att.url),
            ...Array.from(i.attachments.values()).filter(att => att.contentType === 'image/gif').map(att => att.url)
        ]
    } catch (err) {
        return null
    }
}

function timmy() {
    console.log(String.raw`
                       uuuuuuuuuuuuuuuuuuuuu.
                   .u$$$$$$$$$$$$$$$$$$$$$$$$$$W.
                 u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Wu.
               $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
              $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
             .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
           .i$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
           $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
          .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
         .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
         #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.
         W$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$u       #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$~
$#      '"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$i        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$        #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$         $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
#$.        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#
 $$      $iW$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$!
 $$i      $$$$$$$#"" '"""#$$$$$$$$$$$$$$$$$#""""""#$$$$$$$$$$$$$$$W
 #$$W    '$$$#"            "       !$$$$$'           '"#$$$$$$$$$$#
  $$$     ''                 ! !iuW$$$$$                 #$$$$$$$#
  #$$    $u                  $   $$$$$$$                  $$$$$$$~
   "#    #$$i.               #   $$$$$$$.                 '$$$$$$
          $$$$$i.                """#$$$$i.               .$$$$#
          $$$$$$$$!         .   '    $$$$$$$$$i           $$$$$
          '$$$$$  $iWW   .uW'        #$$$$$$$$$W.       .$$$$$$#
            "#$$$$$$$$$$$$#'          $$$$$$$$$$$iWiuuuW$$$$$$$$W
               !#""    ""             '$$$$$$$##$$$$$$$$$$$$$$$$
          i$$$$    .                   !$$$$$$ .$$$$$$$$$$$$$$$#
         $$$$$$$$$$'                    $$$$$$$$$Wi$$$$$$#"#$$'
         #$$$$$$$$$W.                   $$$$$$$$$$$#   ''
          '$$$$##$$$$!       i$u.  $. .i$$$$$$$$$#""
             "     '#W       $$$$$$$$$$$$$$$$$$$'      u$#
                            W$$$$$$$$$$$$$$$$$$      $$$$W
                            $$'!$$$##$$$$''$$$$      $$$$!
                           i$" $$$$  $$#"'  """     W$$$$
                                                   W$$$$!
                      uW$$  uu  uu.  $$$  $$$Wu#   $$$$$$
                     ~$$$$iu$$iu$$$uW$$! $$$$$$i .W$$$$$$
             ..  !   "#$$$$$$$$$$##$$$$$$$$$$$$$$$$$$$$#"
             $$W  $     "#$$$$$$$iW$$$$$$$$$$$$$$$$$$$$$W
             $#'   '       ""#$$$$$$$$$$$$$$$$$$$$$$$$$$$
                              !$$$$$$$$$$$$$$$$$$$$$#'
                              $$$$$$$$$$$$$$$$$$$$$$!
                            $$$$$$$$$$$$$$$$$$$$$$$'
                             $$$$$$$$$$$$$$$$$$$$"
                           ${chalk.bold.redBright('Timmy is ready to Rumble')}

        `)
}

//* Actual Discord bot
const timmybot = {
    start: async () => {
        client.on('ready', async () => { //! Client Ready
            const { functions } = require('./functions/functions.js')
            const { commands } = require('./commands/commands.js')
            const contentWarningMessage = { content: ``, embeds: [{ id: 593955793, description: `# 🚨  INAPPROPRIATE CONTENT   🚨\nThis is a warning, warns about Sussy wussy content that Timmy tried to generate. It's your fault isn't it. Anyways stop doing it! \n\n# NOW!\n** **`, color: 16711680 }] }

            const guild = await client.guilds.fetch(guildID)
            const verificationChannel = await guild.channels.fetch(verificationChannelID)
            const ruleChannel = await guild.channels.fetch(ruleChannelID)
            const supportChannel = await guild.channels.fetch(supportChannelID)
            const aiChannel = await guild.channels.fetch(aiChannelID)

            // await functions.joinMessage(verificationChannel, 0)
            // await functions.joinMessage(ruleChannel, 1)
            // await functions.joinMessage(supportChannel, 2)

            await functions.ai.start()
                .then(supervisor.succeed('AI successfully started'))
                .catch((err) => supervisor.fail(1, err, 'AI failed to start'))

            await functions.peepingTom.initializeInstance()
                .then(supervisor.succeed('successfully started peepingTom'))
                .catch((err) => supervisor.fail(1, err, 'peepingTom failed to start'))


            await commands.initialize()
                .catch((err) => supervisor.fail(1, err, 'commands failed to start'))

            timmy()

            setInterval(await functions.verification.scanUsers, 15000)

            client.on('interactionCreate', (i) => {
                commands.run(i)
                functions.quiz.answer(i)
                functions.supportTicket.answer(i)
                functions.profile.buttonHandler(i)
                functions.profile.modalHandler(i)
            })


            client.on('typingStart', (i) => {
                if (i.channel.id === aiChannelID) {
                    functions.ai.setTimer(10000)
                }
            })

            client.on('messageCreate', async i => {
                if (!i.author.bot && !i.system) {
                    if (/cook/gi.test(i.content)) {
                        i.reply({ content: "Jesse we need to cook." })
                    }
                    if (/lol|lmfao|lmao|haha/gi.test(i.content)) {
                        i.reply({ content: "I know right." })
                    }

                    functions.messageTracking(i)

                    if (i.channelId == aiChannelID) {
                        if (await functions.profile.get(i.author.id) == undefined) {
                            functions.profile.handleNoProfile(i)
                        } else {
                            const message = await functions.ai.msg(i, guild.members.cache.get(i.author.id).nickname, imageToUrl(i))
                            if (message) {
                                aiChannel.send(message)
                            } else if (message == false) {
                                aiChannel.send(contentWarningMessage)
                                functions.peepingTom.notify(`${guild.members.cache.get(i.author.id).nickname} has trigerd the content filter.`)
                            }
                        }
                    }

                    if (i.channelId == "1300952736497406065") {
                        console.log([...guild.channels.cache.get("1300952736497406065").members.keys()]);
                    }

                    try {
                        if (i.channelId == botCommandChannelID) {
                            if (i.mentions.repliedUser.username == 'TimmyBot') {
                                functions.madlibFunc.addWord(i)
                            }
                        }
                    } catch (err) { }
                }
            })
        })
    },
    test: async function () {

        client.on('ready', async () => { //! Client Ready
            const maxpasses = 9
            let passes = 0
            const { verification } = require("./functions/verification.js")
            const { profile } = require("./functions/profile.js")
            const { role } = require("./functions/role.js")
            const guild = await client.guilds.fetch(guildID)
            const member = await guild.members.fetch('1225976620452413551')
            const { moderatorLogsChannelID } = require('../config.json')
            const fs = require('fs')

            const memberID1 = "1225976620452413551"
            const memberID2 = "715043871503024218"

            function getlevel(currentXP, baseXP = 100) {
                let level = 0;
                let xpThreshold = baseXP;
                while (currentXP >= xpThreshold) {
                    xpThreshold += Math.round(baseXP * Math.log(level + 1))
                    level++;
                }
                return {level, xp: xpThreshold - currentXP, maxXp: Math.round(baseXP * Math.log(level))}
            }

            console.log(getlevel(10543));
            

            function pass(output = "") {
                passes++
                console.log(chalk.green(`--TEST PASSED(${passes}/${maxpasses})--${output !== "" ? `: ${output}` : ""}`));
                if (passes == maxpasses) {
                    console.log(chalk.green(`--ALL TESTS PASSED--`));
                }
            }
            function fail(output = "") {
                console.log(chalk.red(`--TEST FAILED--${output !== "" ? `: ${output}` : ""}`));
            }
        })
    }
}

module.exports = { timmybot, client }
client.login(token)