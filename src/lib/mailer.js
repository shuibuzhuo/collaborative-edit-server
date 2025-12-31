const nodemailer = require("nodemailer");

const config = {
  host: process.env.EMAIL_HOST || "",
  port: parseInt(process.env.EMAIL_PORT || "", 10),
  auth: {
    user: process.env.EMAIL_FROM || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
};

const transporter = nodemailer.createTransport(config);

async function sendEmail(option = {}) {
  const { subject, text } = option;

  if (!subject) {
    console.error("subject is required");
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Wont send email in dev env...", subject, text);
    return;
  }

  const mailConfig = {
    from: `划水AI <${process.env.EMAIL_FROM}>`,
    to: process.env.NOTICE_EMAIL_TO,
    subject,
    text,
  };

  const res = await transporter.sendMail(mailConfig);
  console.log("Message sent: %s", res.messageId);
  return res;
}

module.exports = {
  sendEmail,
};
