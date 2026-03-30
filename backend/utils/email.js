// utils/email.js
const nodemailer = require("nodemailer");

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Thiếu biến môi trường: ${key}`);
  return value;
};

const createMailtrapTransport = () => {
  const host = getRequiredEnv("MAILTRAP_HOST");
  const port = Number(process.env.MAILTRAP_PORT || 2525);
  const user = getRequiredEnv("MAILTRAP_USER");
  const pass = getRequiredEnv("MAILTRAP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });
};

exports.sendPasswordResetEmail = async ({ to, username, resetUrl }) => {
  const from = process.env.MAIL_FROM || "no-reply@booking-app.local";
  const transporter = createMailtrapTransport();

  const subject = "Dat lai mat khau tai khoan Booking Web";
  const text = [
    `Xin chao ${username || "ban"},`,
    "",
    "Ban vua yeu cau dat lai mat khau.",
    "Link dat lai mat khau (hieu luc 10 phut):",
    resetUrl,
    "",
    "Neu ban khong yeu cau, vui long bo qua email nay.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
      <p>Xin chao <strong>${username || "ban"}</strong>,</p>
      <p>Ban vua yeu cau dat lai mat khau.</p>
      <p>Link dat lai mat khau (hieu luc 10 phut):</p>
      <p>
        <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">
          ${resetUrl}
        </a>
      </p>
      <p>Neu ban khong yeu cau, vui long bo qua email nay.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
