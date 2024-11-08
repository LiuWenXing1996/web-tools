import { type SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";

// TODO:继续实现email
export const sendEmail = async (params: {
  to: string;
  options: Pick<SendMailOptions, "subject" | "text" | "html">;
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
      user: "web_tools2024@163.com",
      pass: "NAdBMDQYPuPkGMCE",
    },
  });
  const info = await transporter.sendMail({
    from: '"Web Tools" web_tools2024@163.com', // sender address
    to: data.email,
    subject: "Hello ✔",
    text: "Hello worldsss?",
    html: "<b>Hellssso world?</b>",
  });
};

export const sendValidateCode = async () => {};
