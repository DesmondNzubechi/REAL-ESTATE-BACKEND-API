// //NODE MAILER

// const nodemailer = require("nodemailer");
// const AppError = require("../errors/appError");

// const {EMAIL_HOST, EMAIL_PORT, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_FROM} = process.env

// //console.log("the email host", EMAIL_HOST, EMAIL_USERNAME)

// const sendEmail = async (options) => {

//     try {
        

//         //create transport
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             host: EMAIL_HOST,
//             port: EMAIL_PORT,
//             secure: true,
//             auth: {
//                 user: EMAIL_USERNAME,
//                 pass : EMAIL_PASSWORD
//             }
//         })

//         //create the mail option
//         const mailOptions = {
//             to: options.email,
//             from: EMAIL_FROM,
//             text: options.message,
//             subject : options.subject
//         }

//         //finally send the email
//         await transporter.sendMail(mailOptions)

//         console.log('successfully sent')

//     } catch (error) {
//         console.log(error)
//         return new AppError("an error occur please try again", 400)
//     }
// }

// module.exports = sendEmail;

const nodemailer = require("nodemailer");
const AppError = require("../errors/appError");
const pug = require("pug");
const path = require("path");

const { EMAIL_HOST, EMAIL_PORT, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_FROM } = process.env;

const sendEmail = async (options) => {
  try {
    // Create transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    // Render the Pug template to HTML
    const html = pug.renderFile(
      path.join(__dirname, "../view/emailTemplate.pug"),
      {
        subject: options.subject,
        name: options.name,
        message: options.message,
      }
    );

    // Create the mail option
    const mailOptions = {
      to: options.email,
      from: EMAIL_FROM,
      subject: options.subject,
      html, // Use the rendered HTML here
    };

    // Finally, send the email
    await transporter.sendMail(mailOptions);
 
    console.log("Successfully sent");
  } catch (error) {
    console.log(error);
    throw new AppError("An error occurred, please try again", 400);
  }
};

module.exports = sendEmail;
