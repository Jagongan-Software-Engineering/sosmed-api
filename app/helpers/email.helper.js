const nodemailer = require("nodemailer");
const template = require("../templates/verifikasi");

const send = (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USER}>`,
    to: `${data.fullname} <${data.email}>`,
    subject: "Verifikasi",
    html: template.template(data),
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = { send };
