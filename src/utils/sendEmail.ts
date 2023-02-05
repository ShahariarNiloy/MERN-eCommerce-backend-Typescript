import nodeMailer from 'nodemailer'

interface MailOptionType {
    email: string
    subject: string
    message: string
}

const sendEmail = async (options: MailOptionType): Promise<void> => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST as string,
        port: parseInt(process.env.SMPT_PORT as string, 10),
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions)
}

export default sendEmail
