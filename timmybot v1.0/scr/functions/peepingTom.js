const nodemailer = require('nodemailer')
const { email, emailPassword, emailHost, adminEmail, emailservice } = require('../../config.json')
const { supervisor } = require('../../../supervisor')

let transporter

const peepingTom = {
    initializeInstance: async () => {
        try {
            transporter = nodemailer.createTransport({
                service: emailservice,
                host: emailHost,
                port: 465,
                secure: true,
                auth: {
                    user: email,
                    pass: emailPassword
                }
            })

            //TODO: await functions.peepingTom.notify("Timmy is online")
            supervisor.succeed("initialized instance for peeping Tom")
        }
        catch (err) {
            console.log(err);
            supervisor.fail(1, err, "failed to initialize instance for peeping Tom")
        }
    },
    notify: async (message) => {
        const mailOptions = {
            from: email,
            to: adminEmail,
            subject: 'A Message from Timmybot',
            text: message
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = { peepingTom }