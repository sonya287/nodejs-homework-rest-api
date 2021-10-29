const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
const config = require('../config/email.json')
const { emailAddress } = require('../helpers/constants')

class EmailService {
    #sender = sgMail
    #generateTemplate = Mailgen
    constructor(env) {
        switch (env) {
            case 'development':
                this.link = config.dev
                break
            case 'stage':
                this.link = config.stage
                break
            case 'production':
                this.link = config.prod
                break
            default:
                this.link = config.dev
                break
        }
    }

    #createTemplate(verifyToken, name = 'Guest') {
        const mailGenerator = new this.#generateTemplate({
            theme: 'cerberus',
            product: {
                name: 'The best storage of your contacts:)',
                link: this.link
            }
        })
        const template = {
            body: {
                name,
                intro: 'Welcome to \'Your-Contacts!\' We\'re very excited to have you on board.',
                action: {
                    instructions: 'To get started, please click here:',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${this.link}/api/users/verify/${verifyToken}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        return mailGenerator.generate(template)
    }

    async sendEmail(verifyToken, email, name) {
        const emailBody = this.#createTemplate(verifyToken, name)
        this.#sender.setApiKey(process.env.SEVDGRID_API_KEY)
        const msg = {
            to: email,
            from: emailAddress,
            subject: 'Confirmation of registration',
            html: emailBody
        }
        await this.#sender.send(msg)
    }
}

module.exports = EmailService