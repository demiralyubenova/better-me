const cron = require('node-cron');
const sendReminderEmail = require('./emailServices');
const supabase = require('../utils/supabaseClient'); // Връзка със Supabase
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Изпращане на имейли всеки ден в 20:00
cron.schedule('*/1 * * * *', async () => {
  console.log('Изпращане на напомняния за транзакции...');

//   const { data: users, error } = await supabase.from('users').select('email');

//   if (error) {
//     console.error('Грешка при извличане на потребители:', error);
//     return;
//   }

//   users.forEach(user => {
   // sendEmail();
//   });
});

const sendEmail = async () => {
    try {
      let info = await transporter.sendMail({
        from: `"Your Name" <${process.env.EMAIL_USER}>`,
        to: "demira.lyubenova@gmail.com", // Replace with recipient's email
        subject: "Daily Scheduled Email",
        text: "Hello! This is your daily scheduled email.",
        html: "<b>Hello! This is your daily scheduled email.</b>",
      });
      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };