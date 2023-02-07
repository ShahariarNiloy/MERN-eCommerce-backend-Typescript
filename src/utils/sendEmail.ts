import nodeMailer from 'nodemailer'

interface MailOptionType {
    email: string
    subject: string
    message: string
}

const sendEmail = async (options: MailOptionType): Promise<void> => {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMPT_HOST as string,
            port: Number(process.env.SMPT_PORT),
            auth: {
                user: process.env.SMPT_USER,
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
    } catch (err) {
        console.log(err)
    }
}

export default sendEmail
