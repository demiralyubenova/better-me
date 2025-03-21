const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Функция за изпращане на имейл
const sendEmail = async (recipientEmail) => {
  try {
    let info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Напомняне за попълване на данни",
      text: "Здравейте! Това е напомняне да попълните вашите данни.",
      html: "<b>Здравейте! Това е напомняне да попълните вашите данни.</b>",
    });
    console.log(`Email изпратен до ${recipientEmail}:`, info.messageId);
  } catch (error) {
    console.error(`Грешка при изпращане на имейл до ${recipientEmail}:`, error);
  }
};

module.exports = sendEmail;
