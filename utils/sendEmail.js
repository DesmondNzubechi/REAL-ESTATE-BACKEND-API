const nodemailer = require("nodemailer");
const AppError = require("../errors/appError");
const pug = require("pug");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({path : "./config.env"});

//NODEMAILER : FOR SENDING EMAIL TO THE USER'S EMAIL

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
 
  } catch (error) {
    throw new AppError("An error occurred, please try again", 400);
  }
};

module.exports = sendEmail;
