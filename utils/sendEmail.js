const nodemailer = require("nodemailer");
const AppError = require("../errors/appError");

const {EMAIL_HOST, EMAIL_PORT, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_FROM} = process.env

console.log("the email host", EMAIL_HOST, EMAIL_USERNAME) 

const sendEmail = async (options) => {

    try {
        

        //create transport

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: true,
            auth: {
                user: EMAIL_USERNAME,
                pass : EMAIL_PASSWORD
            }
        })

        //create the mail option 
        const mailOptions = {
            to: options.email,
            from: EMAIL_FROM,
            text: options.message,
            subject : options.subject
        } 

        await transporter.sendMail(mailOptions)

        console.log('successfully sent')

    } catch (error) {
        console.log(error)
        return new AppError("an error occur please try again", 400)
    }
}

module.exports = sendEmail;