const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6000;

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send email
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

// Schedule the email to run every day at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("Running scheduled email job...");
  sendEmail();
});

// Start the Express server (optional)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
