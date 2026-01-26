import dotenv from "dotenv";
dotenv.config();import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // IMPORTANT for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: "ThinkBoard <no-reply@thinkboard.local>",
    to,
    subject: "Your ThinkBoard OTP",
    html: `
      <h2>Your OTP is: <b>${otp}</b></h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};
