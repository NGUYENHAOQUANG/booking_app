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

exports.sendPasswordResetOtpEmail = async ({ to, fullName, otp }) => {
  const from = process.env.MAIL_FROM || "no-reply@booking-app.local";
  const transporter = createMailtrapTransport();
  const expiresInMinutes = Number(process.env.PASSWORD_RESET_OTP_EXPIRES_MINUTES || 10);

  const subject = "Ma OTP dat lai mat khau Booking Web";
  const text = [
    `Xin chao ${fullName || "ban"},`,
    "",
    "Ban vua yeu cau dat lai mat khau.",
    `Ma OTP cua ban la: ${otp}`,
    `Ma OTP co hieu luc trong ${expiresInMinutes} phut.`,
    "",
    "Neu ban khong yeu cau, vui long bo qua email nay.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
      <p>Xin chao <strong>${fullName || "ban"}</strong>,</p>
      <p>Ban vua yeu cau dat lai mat khau.</p>
      <p>Ma OTP cua ban la:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
      <p>Ma OTP co hieu luc trong ${expiresInMinutes} phut.</p>
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
