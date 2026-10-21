import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

export const mail = async (subject, text) => {
  const transporter = createTransporter();
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL,
      subject,
      text
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
};

export const mailTo = async (to, subject, text) => {
  const transporter = createTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });
  } catch (err) {
    console.error('Email sending failed:', err.message);
  }
};
