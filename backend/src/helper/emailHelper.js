const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER ,
      pass: process.env.EMAIL_PASS,
    },
    pool: true
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html:text
  };

  return transporter.sendMail(mailOptions);
};
module.exports = { sendEmail };